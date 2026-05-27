/**
 * @param {string} given  - The field value
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (given === null || given === undefined) return [];

  const doc = context.document?.data ?? {};
  const isOAP2 = typeof doc.swagger === 'string';

  const VALID_IN_VALUES_OAP2 = ['query', 'header', 'path', 'formData', 'body'];
  const VALID_IN_VALUES_OAP3 = ['path', 'query', 'header', 'cookie'];
  const VALID_IN_VALUES = isOAP2 ? VALID_IN_VALUES_OAP2 : VALID_IN_VALUES_OAP3;

  const VALID_SCHEMA_TYPES = ['object', 'string', 'number', 'integer', 'boolean', 'array', 'null'];

  const nodePath = context.path || [];
  const fieldName = nodePath[nodePath.length - 1];

  if (fieldName === 'in') {
    if (!VALID_IN_VALUES.includes(String(given))) {
      return [{
        message: `in: Expected one of [${VALID_IN_VALUES.map(v => `"${v}"`).join(', ')}]`,
      }];
    }
  }

  if (fieldName === 'type') {
    if (!VALID_SCHEMA_TYPES.includes(String(given))) {
      return [{
        message: `type: Expected one of [${VALID_SCHEMA_TYPES.map(v => `"${v}"`).join(', ')}]`,
      }];
    }
  }

  return [];
};
