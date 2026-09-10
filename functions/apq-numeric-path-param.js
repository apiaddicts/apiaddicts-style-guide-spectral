/**
 * @param {object} param   the parameter object (given selects params with `in: path`)
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (param, options, context) => {
  const results = [];
  if (!param || typeof param !== 'object' || param.in !== 'path') return results;

  let typeVal;
  let typePath;
  if (param.schema && param.schema.type !== undefined) {
    typeVal = param.schema.type;
    typePath = [...context.path, 'schema', 'type'];
  } else if (param.type !== undefined) {
    typeVal = param.type;
    typePath = [...context.path, 'type'];
  } else {
    return results;
  }

  const types = Array.isArray(typeVal) ? typeVal : [typeVal];
  const isNumeric = types.indexOf('integer') > -1
    || types.indexOf('number') > -1
    || types.indexOf('float') > -1;
  if (!isNumeric) return results;

  const ruleCode = context.rule.name.split(':').pop();
  results.push({
    message: `${ruleCode}: Parameters in path should not be numeric.`,
    path: typePath,
  });
  return results;
};
