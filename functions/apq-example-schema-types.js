function getPrimaryType(type) {
  if (type === undefined || type === null) return null;
  if (Array.isArray(type)) {
    for (const element of type) {
      if (element === null || element === undefined) continue;
      const value = String(element);
      if (value !== 'null') return value;
    }
    return null;
  }
  if (typeof type === 'object') return null;
  return String(type);
}

function determineExampleType(value) {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  return 'string';
}

function schemaTypes(schema) {
  const types = new Map();
  if (!schema || typeof schema !== 'object') return types;
  const { properties } = schema;
  if (!properties || typeof properties !== 'object') return types;
  Object.keys(properties).forEach((name) => {
    const property = properties[name];
    const type = property && typeof property === 'object' ? property.type : undefined;
    types.set(name, getPrimaryType(type));
  });
  return types;
}

function exampleTypes(example) {
  const types = new Map();
  if (!example || typeof example !== 'object' || Array.isArray(example)) return types;
  Object.keys(example).forEach((name) => {
    types.set(name, determineExampleType(example[name]));
  });
  return types;
}

function swaggerExampleTypes(examples) {
  const types = new Map();
  if (!examples || typeof examples !== 'object' || Array.isArray(examples)) return types;
  Object.keys(examples).forEach((mediaType) => {
    const payload = examples[mediaType];
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return;
    Object.keys(payload).forEach((name) => {
      types.set(name, determineExampleType(payload[name]));
    });
  });
  return types;
}

function isCompatible(expectedType, actualType) {
  if (expectedType === null) return true;
  if (actualType === 'null') return true;
  if (expectedType === actualType) return true;
  return expectedType === 'number' && actualType === 'integer';
}

function mismatches(schema, example, isSwagger) {
  const expected = schemaTypes(schema);
  if (expected.size === 0) return false;
  const actual = isSwagger ? swaggerExampleTypes(example) : exampleTypes(example);

  for (const [name, expectedType] of expected) {
    const actualType = actual.has(name) ? actual.get(name) : 'unknown';
    if (!isCompatible(expectedType, actualType)) return true;
  }
  return false;
}

function isPresent(value) {
  return value !== undefined && value !== null;
}

/**
 * @param {object} targetVal a Response Object
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  if (!targetVal || typeof targetVal !== 'object') return [];

  const results = [];
  const { content } = targetVal;

  if (isPresent(content) && typeof content === 'object' && !Array.isArray(content)) {
    Object.keys(content).forEach((mediaType) => {
      const mediaTypeNode = content[mediaType];
      if (!mediaTypeNode || typeof mediaTypeNode !== 'object') return;
      const { schema, example } = mediaTypeNode;
      if (!isPresent(schema) || !isPresent(example)) return;
      if (mismatches(schema, example, false)) {
        results.push({
          message: context.rule.message,
          path: [...context.path, 'content', mediaType, 'example'],
        });
      }
    });
    return results;
  }

  const { schema, examples } = targetVal;
  if (!isPresent(schema) || !isPresent(examples)) return results;
  if (mismatches(schema, examples, true)) {
    results.push({ message: context.rule.message, path: [...context.path, 'examples'] });
  }

  return results;
};
