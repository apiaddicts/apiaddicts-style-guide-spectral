
/**
 * @param {Array<string>} given
 * @param {object} options
 * @param {string} options.property
 * @param {string} options.equalTo
 * @param {string} options.result
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  const errors = [];
  if (!given) return errors;

  if (given[options.property]?.toUpperCase() === given[options.equalTo]?.toUpperCase() && options.result === "falsy") {
    errors.push({
      message: context.rule.message
    });
  }

  //   TODO: When 'truthy' required, implement the following logic:
  //   else if (options.result === 'truthy') {
  //     errors.push({
  //       message: context.rule.message
  //     });
  //   }

  return errors;
};
