const INLINE_FLAGS_REGEX = /^\(\?([a-zA-Z]+)\)/;
const SUPPORTED_INLINE_FLAGS = 'imsu';

/**
 * @param {string} pattern configured regular expression
 * @returns {RegExp|null} the matcher, or null when the pattern is empty or not valid
 */
function buildRegex(pattern) {
  let source = pattern;
  let flags = '';

  const inline = INLINE_FLAGS_REGEX.exec(source);
  if (inline) {
    const requested = inline[1].toLowerCase();
    if ([...requested].every((flag) => SUPPORTED_INLINE_FLAGS.includes(flag))) {
      flags = [...new Set(requested)].join('');
      source = source.slice(inline[0].length);
    }
  }

  if (source === '') {
    return null;
  }

  try {
    return new RegExp(source, flags);
  } catch (e) {
    return null;
  }
}

/**
 * @param {unknown} targetVal value of `info.title`
 * @param {object} options
 * @param {string} options['forbidden-pattern'] regular expression that raises an issue when it
 *   matches the title
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array}>}
 */
module.exports = (targetVal, options, context) => {
  if (typeof targetVal !== 'string') {
    return [];
  }

  const patternStr = options && options['forbidden-pattern'];
  if (typeof patternStr !== 'string' || patternStr === '') {
    return [];
  }

  const regex = buildRegex(patternStr);
  if (regex === null || !regex.test(targetVal)) {
    return [];
  }

  return [
    {
      message: `OAR117: Title '${targetVal}' matches the forbidden pattern: ${patternStr}`,
      path: (context && context.path) || []
    }
  ];
};
