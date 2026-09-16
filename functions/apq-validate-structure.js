const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function getAt(root, path) {
  let node = root;
  for (let i = 0; i < path.length; i += 1) {
    if (!isPlainObject(node) && !Array.isArray(node)) return undefined;
    node = node[path[i]];
  }
  return node;
}

function isReachedViaRef(context, fieldName) {
  const source = context && context.document ? context.document.data : undefined;
  const path = (context && context.path) || [];
  if (!isPlainObject(source) && !Array.isArray(source)) return false;
  const isNestedUnderSchema = fieldName === 'type' && path[path.length - 2] === 'schema';
  const parameterPath = isNestedUnderSchema ? path.slice(0, -2) : path.slice(0, -1);
  const raw = getAt(source, parameterPath);
  return isPlainObject(raw) && typeof raw.$ref === 'string';
}

/**
 * @param {string} given  - The field value
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (given === null || given === undefined) return [];

  const doc = context.document?.data ?? {};
  const isOAP2 = typeof doc.swagger === 'string';
  const openapi = typeof doc.openapi === 'string' ? doc.openapi : '';
  const isOAP32 = openapi.indexOf('3.2') === 0;
  const isNewerOAS = openapi.indexOf('3.1') === 0 || isOAP32;

  const VALID_IN_VALUES_OAP2 = ['query', 'header', 'path', 'formData', 'body'];
  const VALID_IN_VALUES_OAP3 = ['path', 'query', 'header', 'cookie'];
  const VALID_IN_VALUES_OAP32 = VALID_IN_VALUES_OAP3.concat(['querystring']);
  const VALID_IN_VALUES = isOAP2 ? VALID_IN_VALUES_OAP2 : (isOAP32 ? VALID_IN_VALUES_OAP32 : VALID_IN_VALUES_OAP3);

  const VALID_SCHEMA_TYPES = ['object', 'string', 'number', 'integer', 'boolean', 'array', 'null'];

  const nodePath = context.path || [];
  const fieldName = nodePath[nodePath.length - 1];

  if ((fieldName === 'in' || fieldName === 'type') && isReachedViaRef(context, fieldName)) return [];

  if (fieldName === 'in') {
    if (!VALID_IN_VALUES.includes(String(given))) {
      const issue = {
        message: `in: Expected one of [${VALID_IN_VALUES.map(v => `"${v}"`).join(', ')}]`,
      };
      if (isOAP2) issue.path = nodePath.slice(0, -1);
      return [issue];
    }
  }

  if (fieldName === 'type' && !isNewerOAS) {
    if (!VALID_SCHEMA_TYPES.includes(given)) {
      return [{
        message: `type: Expected one of [${VALID_SCHEMA_TYPES.map(v => `"${v}"`).join(', ')}]`,
      }];
    }
  }

  return [];
};
