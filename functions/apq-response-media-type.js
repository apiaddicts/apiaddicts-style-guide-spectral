/**
 * @param {object} given
 * @param {object} options
 * @param {string} options['default-media-type']
 * @param {string} options['media-type-exceptions']
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */

const BODY_ALLOWED_METHODS = new Set(['post', 'put', 'patch']);

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
  const path = context.path;
  const lastSegment = path[path.length - 1];

  if (root.swagger) {
    if (given.responses === undefined) return errors;

    const method = path[path.length - 1];
    if (!BODY_ALLOWED_METHODS.has(method)) return errors;

    const hasOwnProduces = given.produces !== undefined && given.produces !== null;
    const produces = hasOwnProduces ? given.produces : root.produces;
    const supported = Array.isArray(produces) && produces.some((mediaType) => isSupported(String(mediaType).toLowerCase(), defaultMediaType, exceptions));
    if (!supported) {
      errors.push({
        message: context.rule.message,
        path: hasOwnProduces ? [...path, 'produces'] : [...path]
      });
    }

    return errors;
  }

  if (given.responses !== undefined) return errors;

  if (lastSegment === 'content') {
    const contentTypes = Object.keys(given);
    const supported = contentTypes.some((mediaType) => isSupported(mediaType.toLowerCase(), defaultMediaType, exceptions));
    if (!supported) {
      errors.push({ message: context.rule.message, path: [...path] });
    }
    return errors;
  }

  const hasContentKey = given.content !== undefined && given.content !== null;
  if (!hasContentKey) {
    errors.push({ message: context.rule.message, path: [...path] });
  }

  return errors;
};
