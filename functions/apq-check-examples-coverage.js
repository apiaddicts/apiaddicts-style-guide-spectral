const COMBINERS = ['allOf', 'oneOf', 'anyOf'];

const typeIncludes = (type, name) => (Array.isArray(type) ? type.includes(name) : type === name);

const isOn = (value) => value !== false;

const schemaHasRootExample = (schema) =>
  !!schema && typeof schema === 'object'
  && (schema.example !== undefined || schema.examples !== undefined);

const hasParameterExample = (param) => {
  if (!param || typeof param !== 'object') return false;
  if (param.example !== undefined || param.examples !== undefined) return true;
  if (schemaHasRootExample(param.schema)) return true;
  if (param.content && typeof param.content === 'object') {
    return Object.values(param.content).some(
      (mt) => mt && typeof mt === 'object'
        && (mt.example !== undefined || mt.examples !== undefined || schemaHasRootExample(mt.schema)),
    );
  }
  return false;
};

const hasBodyLevelExample = (node) => {
  if (!node || typeof node !== 'object') return false;
  if (node.content && typeof node.content === 'object') {
    return Object.values(node.content).some(
      (mt) => mt && typeof mt === 'object'
        && (mt.example !== undefined || mt.examples !== undefined || schemaHasRootExample(mt.schema)),
    );
  }
  if (node.examples !== undefined) return true;
  if (schemaHasRootExample(node.schema)) return true;
  return false;
};

const collectPropertyIssues = (schema, issues, basePath) => {
  if (!schema || typeof schema !== 'object' || schema.$ref) return;

  if (typeIncludes(schema.type, 'array')) {
    if (schema.items) collectPropertyIssues(schema.items, issues, [...basePath, 'items']);
    return;
  }

  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      if (!propSchema || typeof propSchema !== 'object' || propSchema.$ref) continue;
      const propPath = [...basePath, 'properties', propName];
      const propType = propSchema.type;
      if (typeIncludes(propType, 'object') || typeIncludes(propType, 'array') || (!propType && propSchema.properties)) {
        collectPropertyIssues(propSchema, issues, propPath);
      } else if (propType !== undefined && propSchema.example === undefined && propSchema.examples === undefined) {
        issues.push({
          message: `OAR031: Property '${propName}' is missing an example.`,
          path: propPath,
        });
      }
    }
  }

  COMBINERS.forEach((c) => {
    if (Array.isArray(schema[c])) {
      schema[c].forEach((sub, i) => collectPropertyIssues(sub, issues, [...basePath, c, i]));
    }
  });
};

const collectBodyProperties = (node, issues, basePath) => {
  if (node.content && typeof node.content === 'object') {
    Object.entries(node.content).forEach(([mediaType, mt]) => {
      if (mt?.schema) collectPropertyIssues(mt.schema, issues, [...basePath, 'content', mediaType, 'schema']);
    });
  } else if (node.schema) {
    collectPropertyIssues(node.schema, issues, [...basePath, 'schema']);
  }
};

/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = function oar031ExamplesCoverage(given, options, context) {
  if (!given || typeof given !== 'object') return [];

  const opts = options || {};
  const validateResponse = isOn(opts.validateResponse);
  const validateRequestBody = isOn(opts.validateRequestBody);
  const validateParameter = isOn(opts.validateParameter);
  const validateProperty = isOn(opts.validateProperty);

  const issues = [];
  const nodePath = context.path || [];
  const isParameter = nodePath.length >= 2 && nodePath.at(-2) === 'parameters';
  const isRequestBody = nodePath.at(-1) === 'requestBody';

  if (isParameter) {
    const doc = context.document?.data ?? {};
    const isOAP2 = typeof doc.swagger === 'string';
    if (isOAP2 && given.in !== 'body') {
      return issues;
    }
    if (validateParameter && !hasParameterExample(given)) {
      issues.push({
        message: `OAR031: Parameter '${given.name || ''}' must have an example defined`,
        path: nodePath,
      });
    }
    if (given.in === 'body' && validateProperty && given.schema) {
      collectPropertyIssues(given.schema, issues, [...nodePath, 'schema']);
    }
    return issues;
  }

  const levelOn = isRequestBody ? validateRequestBody : validateResponse;
  const levelMessage = isRequestBody
    ? 'OAR031: Request body must have an example defined'
    : 'OAR031: Response must have an example defined';

  if (levelOn && !hasBodyLevelExample(given)) {
    issues.push({ message: levelMessage, path: nodePath });
  }

  if (validateProperty) {
    collectBodyProperties(given, issues, nodePath);
  }

  return issues;
};
