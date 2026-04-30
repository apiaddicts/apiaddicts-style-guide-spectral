/**
 * Validates that path parameters don't appear as query parameters
 * This prevents ambiguity and design issues
 *
 * @param {object} given - The paths object
 * @param {object} options - Function options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  const errors = [];

  if (!given || typeof given !== 'object') {
    return errors;
  }

  const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];

  for (const [pathKey, pathItem] of Object.entries(given)) {
    if (!pathItem || typeof pathItem !== 'object') {
      continue;
    }

    for (const [operationKey, operation] of Object.entries(pathItem)) {
      if (!operation || typeof operation !== 'object' ||
          !httpMethods.includes(operationKey)) {
        continue;
      }

      const parameters = operation.parameters || [];

      if (!Array.isArray(parameters)) {
        continue;
      }

      const hasPathOrQueryParams = parameters.some(
        param => param && (param.in === 'path' || param.in === 'query')
      );

      if (!hasPathOrQueryParams) {
        continue;
      }

      const responses = operation.responses || {};
      if (!responses['400']) {
        errors.push({
          message: `OAR069: Any param in PATH or QUERY, should have bad request (400) response.`,
          path: [...context.path, pathKey, operationKey, 'responses']
        });
      }
    }
  }

  return errors;
};
