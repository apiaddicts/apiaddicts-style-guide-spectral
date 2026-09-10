/**
 * @param {object} node
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (node, options, context) => {
  const results = [];

  if (!node || typeof node !== 'object') return results;

  const { type } = node;
  const types = Array.isArray(type) ? type : [type];
  const isNumeric = types.indexOf('integer') > -1 || types.indexOf('number') > -1;
  if (!isNumeric) return results;

  const has = (field) => Object.prototype.hasOwnProperty.call(node, field);
  const hasMin = has('minimum');
  const hasMax = has('maximum');
  const hasFormat = has('format');

  const hasBothBounds = hasMin && hasMax;
  const formatAlone = hasFormat && !hasMin && !hasMax;

  if (hasBothBounds || formatAlone) return results;

  const ruleCode = context.rule.name.split(':').pop();
  results.push({
    message: `${ruleCode}: Numeric parameter should define both 'minimum' and 'maximum', or a 'format' restriction.`,
    path: [...context.path, 'type'],
  });

  return results;
};
