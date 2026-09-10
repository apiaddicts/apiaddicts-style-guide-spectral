const NON_SCHEMA_CONTAINERS = new Set(['example', 'examples', 'default', 'enum']);

function isInsideNonSchemaValue(path) {
  for (let i = 0; i < path.length; i += 1) {
    const segment = path[i];
    if (typeof segment !== 'string' || !NON_SCHEMA_CONTAINERS.has(segment)) continue;
    if (i > 0 && path[i - 1] === 'properties') continue;
    return true;
  }
  return false;
}

function isResponseJsonSchema(path) {
  const n = path.length;
  if (path[n - 1] !== 'schema') return false;
  if (n >= 5 && path[n - 2] === 'application/json' && path[n - 3] === 'content' && path[n - 5] === 'responses') {
    return true;
  }
  return n >= 3 && path[n - 3] === 'responses';
}

function isObjectType(type) {
  return type === 'object' || (Array.isArray(type) && type.indexOf('object') > -1);
}

/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  const results = [];

  if (!given || typeof given !== 'object') return results;
  if (isInsideNonSchemaValue(context.path)) return results;

  if (!isObjectType(given.type) && !isResponseJsonSchema(context.path)) return results;

  const { required, properties } = given;
  if (!Array.isArray(required)) return results;

  const propertyNames = new Set(Object.keys(properties || {}));
  const ruleCode = context.rule.name.split(':').pop();

  required.forEach((field, index) => {
    if (!propertyNames.has(field)) {
      results.push({
        message: `${ruleCode}: This value does not exist, '${field}' must be defined in the schema properties.`,
        path: [...context.path, 'required', index],
      });
    }
  });

  return results;
};