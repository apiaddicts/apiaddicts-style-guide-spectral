const DEFAULT_PATHS = '\\/me(\\/|$);status|health|ping';
const PATH_PARAM_SUFFIX_REGEX = /\/\{[^}]+\}$/;
const STRATEGY_INCLUDE = 'Include';
const STRATEGY_EXCLUDE = 'Exclude';

const parsePathPatterns = (paths, ruleCode) => paths
  .split(/[\n;]/)
  .map((p) => p.trim())
  .filter(Boolean)
  .map((pattern) => {
    try {
      return new RegExp(pattern);
    } catch (err) {
      throw new Error(`${ruleCode}: Invalid regex "${pattern}" in "paths": ${err.message}`);
    }
  });

const shouldIncludePath = (path, patterns, strategy) => {
  const matchesList = patterns.some((regex) => regex.test(path));
  return strategy === STRATEGY_INCLUDE ? matchesList : !matchesList;
};

const hasQueryParameter = (parameters, parameterName) => Array.isArray(parameters)
  && parameters.some((p) => p && !p.$ref && p.name === parameterName && p.in === 'query');

/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options = {}, context) => {
  if (!given || typeof given !== 'object') return [];

  const ruleCode = context && context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'apq-collection-query-param-required';

  const parameterName = options['parameter-name'];
  if (!parameterName) {
    return [{
      message: `${ruleCode}: "parameter-name" functionOption is required.`,
      path: context.path,
    }];
  }

  const strategy = options.pathValidationStrategy === STRATEGY_INCLUDE
    ? STRATEGY_INCLUDE
    : STRATEGY_EXCLUDE;

  let patterns;
  try {
    const rawPaths = typeof options.paths === 'string' ? options.paths : DEFAULT_PATHS;
    patterns = parsePathPatterns(rawPaths, ruleCode);
  } catch (error) {
    return [{ message: error.message, path: context.path }];
  }

  const results = [];

  Object.entries(given).forEach(([path, pathItem]) => {
    if (!pathItem || typeof pathItem !== 'object') return;

    const getOperation = pathItem.get;
    if (!getOperation || typeof getOperation !== 'object') return;

    if (PATH_PARAM_SUFFIX_REGEX.test(path)) return;
    if (!shouldIncludePath(path, patterns, strategy)) return;

    if (!hasQueryParameter(getOperation.parameters, parameterName)) {
      results.push({
        message: `${ruleCode}: ${parameterName} must be defined as a query parameter in this operation.`,
        path: [...context.path, path, 'get'],
      });
    }
  });

  return results;
};
