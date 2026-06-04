const COMBINERS = ['allOf', 'oneOf', 'anyOf'];

const checkSchema = (schema) => {
  if (!schema || typeof schema !== 'object') return false;
  if (schema.example !== undefined || schema.examples !== undefined) return true;
  if (schema.properties) return Object.values(schema.properties).some(checkSchema);
  if (schema.items) return checkSchema(schema.items);
  return COMBINERS.some(c => Array.isArray(schema[c]) && schema[c].some(checkSchema));
};

const hasExample = (node) => {
  if (!node || typeof node !== 'object') return false;
  if (node.example !== undefined || node.examples !== undefined) return true;
  if (node.content) return Object.values(node.content).some(hasExample);
  if (node.schema) return checkSchema(node.schema);
  return !!(node.properties || node.items || node.type) && checkSchema(node);
};

const collectPropertyIssues = (schema, issues) => {
  if (!schema || typeof schema !== 'object' || schema.$ref) return;

  if (schema.type === 'array') {
    schema.items && collectPropertyIssues(schema.items, issues);
    return;
  }

  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      if (!propSchema || typeof propSchema !== 'object' || propSchema.$ref) continue;
      const propType = propSchema.type;
      if (propType === 'object' || propType === 'array' || (!propType && propSchema.properties)) {
        collectPropertyIssues(propSchema, issues);
      } else if (propType !== undefined && propSchema.example === undefined && propSchema.examples === undefined) {
        issues.push({ message: `OAR031: Property '${propName}' is missing an example.` });
      }
    }
  }

  COMBINERS.forEach(c => {
    if (Array.isArray(schema[c])) schema[c].forEach(sub => collectPropertyIssues(sub, issues));
  });
};

/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = function oar031ExamplesCoverage(given, options, context) {
  if (!given || typeof given !== 'object') return [];

  const issues = [];
  const nodePath = context.path || [];
  const isParameter = nodePath.length >= 2 && nodePath.at(-2) === 'parameters';
  const isBodyParam = isParameter && given.in === 'body';

  if (!hasExample(given)) {
    issues.push({ message: 'OAR031: Must have one or more examples defined' });
  }

  if (!isParameter || isBodyParam) {
    if (given.content) {
      Object.values(given.content).forEach(mt => {
        if (mt?.schema) collectPropertyIssues(mt.schema, issues);
      });
    } else if (given.schema) {
      collectPropertyIssues(given.schema, issues);
    }
  }

  return issues;
};
