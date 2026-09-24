/**
 * @param {object} given - the matched $total parameter (already resolved by Spectral)
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') return [];

  const doc = context.document?.data ?? {};
  const isOAP2 = typeof doc.swagger === 'string';

  const defaultValue = isOAP2 ? given.default : given.schema && given.schema.default;

  if (defaultValue === undefined || defaultValue === false) return [];

  const path = isOAP2
    ? [...context.path, 'default']
    : [...context.path, 'schema', 'default'];

  return [{
    message: 'OAR026: The $total parameter default value should be false.',
    path,
  }];
};
