const DEFAULT_CONVENTION = 'kebab-case';

const NAMING_REGEX = {
  snake_case: /^[a-z0-9_$]+$/,
  'kebab-case': /^[a-z0-9-]+$/,
  camelCase: /^[a-z0-9]+(?:[A-Z][a-z0-9]+)*[A-Z]?$/,
  UpperCamelCase: /^[0-9]*(?:[A-Z][a-z0-9]+)*[A-Z]?$/
};

const SUFFIX_REGEX = /^[a-z0-9]+$/;
const PARAM_REGEX = /\{[^}{]*}/g;
const URL_AUTHORITY_REGEX = /^(?:(?:[a-zA-Z][a-zA-Z0-9+.-]*|\{[^}{]*}):)?\/\/[^/?#]*/;
const URL_QUERY_OR_FRAGMENT_REGEX = /[?#].*$/;

function resolveConvention(option) {
  if (typeof option !== 'string') return DEFAULT_CONVENTION;
  const wanted = option.trim().toLowerCase();
  return Object.keys(NAMING_REGEX).find((name) => name.toLowerCase() === wanted) || DEFAULT_CONVENTION;
}

function isPathKey(path) {
  return path.length === 2 && path[0] === 'paths';
}

function isServerUrl(path) {
  return path[path.length - 1] === 'url';
}

function urlPath(value) {
  return value.replace(URL_AUTHORITY_REGEX, '').replace(URL_QUERY_OR_FRAGMENT_REGEX, '');
}

function isCompliant(path, regex) {
  return path.replace(PARAM_REGEX, '').split('/').every((segment) => {
    const [name, ...suffixes] = segment.split('.');
    return (name === '' || regex.test(name))
      && suffixes.every((suffix) => suffix === '' || SUFFIX_REGEX.test(suffix) || regex.test(suffix));
  });
}

/**
 * @param {string} given path key, server URL or basePath
 * @param {object} options
 * @param {string} options['naming-convention'] snake_case, kebab-case (default), camelCase or UpperCamelCase, trimmed and
 * case-insensitive; any other value falls back to kebab-case
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (typeof given !== 'string') {
    return [];
  }

  const target = context.path;
  if (isPathKey(target) && !given.startsWith('/')) {
    return [];
  }

  const convention = resolveConvention(options && options['naming-convention']);
  const regex = NAMING_REGEX[convention];
  const value = !isPathKey(target) && isServerUrl(target) ? urlPath(given) : given;

  if (isCompliant(value, regex)) {
    return [];
  }

  return [
    {
      message: `Value '${given}' does not follow the '${convention}' naming convention.`,
      path: target
    }
  ];
};
