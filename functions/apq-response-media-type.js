/**
 * @param {object} given
 * @param {object} options
 * @param {string} options['default-media-type']
 * @param {string} options['media-type-exceptions']
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */

const NO_BODY_CODES = new Set(['204']);

function parseExceptions(value) {
  return new Set(
    String(value ?? '-')
      .split(',')
      .map((mediaType) => mediaType.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isSupported(mediaType, defaultMediaType, exceptions) {
  return mediaType === defaultMediaType || exceptions.has(mediaType);
}

module.exports = (given, options, context) => {
  const errors = [];
  if (!given) return errors;

  const defaultMediaType = ((options && options['default-media-type']) || 'application/json').toLowerCase();
  const exceptions = parseExceptions(options && options['media-type-exceptions']);

  const root = context.document.parserResult.data;

  if (root.swagger) {
    const produces = given.produces ?? root.produces;

    if (
      !produces ||
      !Array.isArray(produces) ||
      !produces.some((mediaType) => isSupported(String(mediaType).toLowerCase(), defaultMediaType, exceptions))
    ) {
      errors.push({
        message: context.rule.message,
        path: [...context.path]
      });
    }

    return errors;
  }

  const responses = given.responses;
  if (!responses) return errors;

  for (const [statusCode, response] of Object.entries(responses)) {
    if (NO_BODY_CODES.has(statusCode)) continue;

    const contentTypes = response?.content ? Object.keys(response.content) : [];
    const supported = contentTypes.some((mediaType) => isSupported(mediaType.toLowerCase(), defaultMediaType, exceptions));

    if (!supported) {
      errors.push({
        message: context.rule.message,
        path: [...context.path, 'responses', statusCode]
      });
    }
  }

  return errors;
};
