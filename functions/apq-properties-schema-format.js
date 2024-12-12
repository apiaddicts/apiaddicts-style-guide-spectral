// Check that format is valid for a schema type.

/**
 * @param {object} given
 * @param {object} options
 * @param {Array<string>} options.formats
 * @param {Array<string>} options.properties
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = function checkTypeAndFormat(given, options, context) {
  if (given === null || typeof given !== "object") {
    return [];
  }

  const errors = [];
  const path = context.path || [];
  const name = path.slice(-1)[0].toString();

  if (options.properties.includes(name)) {
    if (!given.format || !options.formats.includes(given.format)) {
      errors.push({
        message: context.rule.message,
        path: [...path, name]
      });
    }
  }

  return errors;
};
