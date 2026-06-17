const COMBINERS = ['allOf', 'oneOf', 'anyOf'];

// A level is validated unless explicitly turned off with `false`.
const isOn = (value) => value !== false;

// Whole-body (root) example declared directly on a schema node.
const schemaHasRootExample = (schema) =>
  !!schema && typeof schema === 'object'
  && (schema.example !== undefined || schema.examples !== undefined);

// Parameter-level example: param.example/examples, the param schema's root example,
// or a media-type example under param.content (OAS3). OAS2 params use param.example.
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

// Body-level (whole response / requestBody) example: a media-type example/examples or a
// root schema example. OAS3 -> content.<mt>.{example|examples|schema.example}.
// OAS2 -> node.examples map or node.schema root example.
const hasBodyLevelExample = (node) => {
  if (!node || typeof node !== 'object') return false;
  if (node.content && typeof node.content === 'object') {
    return Object.values(node.content).some(
      (mt) => mt && typeof mt === 'object'
        && (mt.example !== undefined || mt.examples !== undefined || schemaHasRootExample(mt.schema)),
    );
  }
  if (node.examples !== undefined) return true; // OAS2 response-level examples map
  if (schemaHasRootExample(node.schema)) return true; // OAS2 root schema example
  return false;
};

// Per-leaf-property example check (recurses objects, arrays and combiners).
const collectPropertyIssues = (schema, issues, basePath) => {
  if (!schema || typeof schema !== 'object' || schema.$ref) return;

  if (schema.type === 'array') {
    if (schema.items) collectPropertyIssues(schema.items, issues, [...basePath, 'items']);
    return;
  }

  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      if (!propSchema || typeof propSchema !== 'object' || propSchema.$ref) continue;
      const propPath = [...basePath, 'properties', propName];
      const propType = propSchema.type;
      if (propType === 'object' || propType === 'array' || (!propType && propSchema.properties)) {
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

// Property-level coverage for a response / requestBody node (OAS3 content.* or OAS2 schema).
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
 * OAR031 — examples coverage, validated independently per level. Each level can be
 * switched off via functionOptions (all default on):
 *   validateResponse, validateRequestBody, validateParameter, validateProperty
 *
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
    if (validateParameter && !hasParameterExample(given)) {
      issues.push({
        message: `OAR031: Parameter '${given.name || ''}' must have an example defined`,
        path: nodePath,
      });
    }
    // OAS2 body parameters carry a schema, so property-level coverage applies to them too.
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
