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

    const sharedParams = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];

    for (const [operationKey, operation] of Object.entries(pathItem)) {
      if (!operation || typeof operation !== 'object' ||
          !httpMethods.includes(operationKey)) {
        continue;
      }

      const operationParams = Array.isArray(operation.parameters) ? operation.parameters : [];
      if (sharedParams.length === 0 && operationParams.length === 0) {
        continue;
      }

      const responses = operation.responses || {};
      const has400 = Boolean(responses['400']);
      if (has400) {
        continue;
      }

      const overridden = new Set(
        operationParams
          .filter((p) => p && p.name && p.in)
          .map((p) => `${p.in}:${p.name}`)
      );

      operationParams.forEach((param, index) => {
        if (param && (param.in === 'path' || param.in === 'query')) {
          errors.push({
            message: context.rule.message,
            path: [...context.path, pathKey, operationKey, 'parameters', index]
          });
        }
      });

      sharedParams.forEach((param, index) => {
        if (!param || (param.in !== 'path' && param.in !== 'query')) return;
        if (overridden.has(`${param.in}:${param.name}`)) return;
        errors.push({
          message: context.rule.message,
          path: [...context.path, pathKey, 'parameters', index]
        });
      });
    }
  }

  return errors;
};
