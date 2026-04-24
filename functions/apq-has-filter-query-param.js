/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const params = given.parameters;

  if (!params || !Array.isArray(params)) {
    return [{ message: context.rule.message }];
  }

  const hasFilter = params.some(
    p => p && !p.$ref && p.name === '$filter' && p.in === 'query'
  );

  if (!hasFilter) {
    return [{ message: context.rule.message }];
  }

  return [];
};