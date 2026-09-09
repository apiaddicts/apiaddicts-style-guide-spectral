const NAMING_REGEX = {
  snake_case: /^[a-z0-9_$]*$/,
  'kebab-case': /^[a-z0-9-.]*$/,
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  UpperCamelCase: /^[A-Z][a-zA-Z0-9]*$/
};

const PARAM_REGEX = /\{[^}{]*}/g;
const URL_PREFIX_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^/]*/;

function stripParams(name) {
  return name.indexOf('/') >= 0 ? name.replace(PARAM_REGEX, '') : name;
}

function extractUrlPath(value) {
  const match = URL_PREFIX_REGEX.exec(value);
  return match ? value.slice(match[0].length) : value;
}

function isValid(name, convention) {
  const regex = NAMING_REGEX[convention];
  if (convention === 'camelCase' || convention === 'UpperCamelCase') {
    const joined = name.replace(/\//g, '');
    if (joined.includes('_') || joined.includes('-')) return false;
    return regex.test(joined);
  }
  const separator = convention === 'kebab-case' ? '-' : '_';
  return regex.test(name.replace(/\//g, separator));
}

/**
 * @param {string} given
 * @param {object} options
 * @param {string} options['naming-convention']
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (typeof given !== 'string') {
    return [];
  }

  const convention = (options && options['naming-convention']) || 'kebab-case';
  if (!NAMING_REGEX[convention]) {
    return [];
  }

  const name = stripParams(extractUrlPath(given));

  if (!isValid(name, convention)) {
    return [
      {
        message: `Value '${given}' does not follow the '${convention}' naming convention.`,
        path: context.path
      }
    ];
  }

  return [];
};
