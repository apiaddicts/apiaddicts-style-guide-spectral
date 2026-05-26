/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') return [];

  const issues = [];
  const nodePath = context.path || [];

  const isParameter = nodePath.length >= 2 && nodePath[nodePath.length - 2] === 'parameters';

  const checkSchema = (schema) => {
    if (!schema || typeof schema !== 'object') return false;
    if (schema.example !== undefined || schema.examples !== undefined) return true;
    if (schema.properties && typeof schema.properties === 'object') {
      return Object.values(schema.properties).some(prop => checkSchema(prop));
    }
    if (schema.items) return checkSchema(schema.items);
    for (const combiner of ['allOf', 'oneOf', 'anyOf']) {
      if (schema[combiner] && Array.isArray(schema[combiner])) {
        if (schema[combiner].some(sub => checkSchema(sub))) return true;
      }
    }
    return false;
  };

  const hasExample = (node) => {
    if (!node || typeof node !== 'object') return false;
    if (node.example !== undefined || node.examples !== undefined) return true;
    if (node.content && typeof node.content === 'object') {
      return Object.values(node.content).some(mediaType => hasExample(mediaType));
    }
    if (node.schema) return checkSchema(node.schema);
    if (node.properties || node.items || node.type) return checkSchema(node);
    return false;
  };

  if (!hasExample(given)) {
    issues.push({ message: 'OAR031: Must have one or more examples defined' });
  }

  if (!isParameter) {
    const collectPropertyIssues = (schema, path) => {
      if (!schema || typeof schema !== 'object' || schema.$ref) return;

      if (schema.type === 'array' && schema.items) {
        collectPropertyIssues(schema.items, [...path, 'items']);
        return;
      }

      if (schema.properties && typeof schema.properties === 'object') {
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
          if (!propSchema || typeof propSchema !== 'object' || propSchema.$ref) continue;

          const propType = propSchema.type;

          if (propType === 'object' || (!propType && propSchema.properties)) {
            collectPropertyIssues(propSchema, [...path, 'properties', propName]);
          } else if (propType === 'array') {
            collectPropertyIssues(propSchema, [...path, 'properties', propName]);
          } else {
            if (propSchema.example === undefined && propSchema.examples === undefined) {
              issues.push({ message: `OAR031: Property '${propName}' is missing an example.` });
            }
          }
        }
      }

      for (const combiner of ['allOf', 'oneOf', 'anyOf']) {
        if (schema[combiner] && Array.isArray(schema[combiner])) {
          schema[combiner].forEach((sub, i) => {
            collectPropertyIssues(sub, [...path, combiner, i]);
          });
        }
      }
    };

    if (given.content && typeof given.content === 'object') {
      for (const [mediaType, mediaTypeNode] of Object.entries(given.content)) {
        if (mediaTypeNode && mediaTypeNode.schema) {
          collectPropertyIssues(mediaTypeNode.schema, ['content', mediaType, 'schema']);
        }
      }
    } else if (given.schema) {
      collectPropertyIssues(given.schema, ['schema']);
    }
  }

  return issues;
};
