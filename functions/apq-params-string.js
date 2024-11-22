const URL_MAX_LENGTH = 2083;

/**
 * `given` is a (resolved) parameter entry at the path or operation level
 * @param {Array<string>} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
*/
module.exports = (given, options, context) => {
  if (given === null || typeof given !== "object") {
    return [];
  }

  const path = context.path || context.target || [];

  // These errors will be caught elsewhere, so silently ignore here
  if (!given.in || !given.name) {
    return [];
  }

  const errors = [];

  // If the parameter contains a schema, then this must be oas3
  const isOas3 = !!given.schema;

  const schema = isOas3 ? given.schema : given;
  if (schema.type !== "string") {
    return errors;
  }

  // Ignore if format is specified
  if (schema.format) {
    return errors;
  }

  if (!schema.maxLength && !schema.pattern) {
    errors.push({
      message: "Path and query parameters should specify a maximum length (maxLength) and characters allowed (pattern)."
    });
  } else if (!schema.maxLength) {
    errors.push({
      message: "Path and query parameters should specify a maximum length (maxLength)."
    });
  } else if (schema.maxLength && schema.maxLength >= URL_MAX_LENGTH) {
    errors.push({
      message: `Path and query parameters maximum length should be less than ${URL_MAX_LENGTH}`
    });
  } else if (!schema.pattern) {
    errors.push({
      message: "Path and query parameters should specify characters allowed (pattern)."
    });
  }

  return errors;
};
