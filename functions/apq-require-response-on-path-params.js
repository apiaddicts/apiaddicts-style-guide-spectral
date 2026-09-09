/**
 * @param {object} given
 * @param {object} options
 * @param {string} options.paths Comma-separated list of paths to include/exclude (exact match)
 * @param {string} options.pathValidationStrategy "/include" or "/exclude" (default "/exclude")
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const excludedPaths = ((options && options.paths) || '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean);
  const strategy = (options && options.pathValidationStrategy) || '/exclude';
  const currentPath = context.path[context.path.length - 2];
  const isListed = excludedPaths.includes(currentPath);
  const shouldExclude = strategy === '/exclude' ? isListed : !isListed;
  if (shouldExclude) return [];

  const pathItemKeyIndex = context.path?.length - 2;
  const pathItem = typeof pathItemKeyIndex === 'number'
    ? context.path?.[pathItemKeyIndex]
    : null;

  const pathParams = (pathItem?.parameters || []).filter(
    p => p?.in === 'path'
  );

  const operationParams = (given.parameters || []).filter(
    p => p?.in === 'path'
  );

  if (pathParams.length === 0 && operationParams.length === 0) {
    return [];
  }

  const responses = given?.responses || {};

  if (!responses['404']) {
    return [
      {
        message: context.rule.message,
      }
    ];
  }

  return [];
};
