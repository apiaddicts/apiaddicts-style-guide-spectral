/**
 * @param {object} given
 * @param {object} options
 * @param {string} options.match
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
    const errors = [];
    if (!given) return errors;

    if (!given.default || given.default.toString() !== options.match.toString()) {
      errors.push({
          message: context.rule.message,
      });
    }

    return errors;
}