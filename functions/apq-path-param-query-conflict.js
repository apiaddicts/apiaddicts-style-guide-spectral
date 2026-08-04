/**
 *
 * @param {object} given - The paths object ($.paths)
 * @param {object} options - Function options (unused)
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

      const parameters = operation.parameters;
      if (!Array.isArray(parameters)) {
        continue;
      }

      const responses = operation.responses || {};
      const has400 = Boolean(responses['400']);
      if (has400) {
        continue;
      }

      parameters.forEach((param, index) => {
        if (param && (param.in === 'path' || param.in === 'query')) {
          errors.push({
            message: context.rule.message,
            path: [...context.path, pathKey, operationKey, 'parameters', index]
          });
        }
      });
    }
  }

  return errors;
};
