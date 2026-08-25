
const DEFAULT_PATHS = '/me;/health;/ping;/status';
const PATH_PARAM_SUFFIX_REGEX = /\/\{[^}]+\}$/;
const STRATEGY_INCLUDE = 'Include';
const STRATEGY_EXCLUDE = 'Exclude';

const escapeRegExp = (segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePathPatterns = (paths) => paths
  .split(/[\n;,]/)
  .map((p) => p.trim())
  .filter(Boolean)
  .map((segment) => new RegExp(`${escapeRegExp(segment)}(/|$)`));

const normalizeStrategy = (value) => {
  const normalized = String(value == null ? '' : value).trim().replace(/^\//, '').toLowerCase();
  return normalized === 'include' ? STRATEGY_INCLUDE : STRATEGY_EXCLUDE;
};

const shouldIncludePath = (path, patterns, strategy) => {
  const matchesList = patterns.some((regex) => regex.test(path));
  return strategy === STRATEGY_INCLUDE ? matchesList : !matchesList;
};

const resolveRef = (ref, context) => {
  const root = context && context.document && context.document.resolved;
  if (!root || typeof ref !== 'string' || !ref.startsWith('#/')) return undefined;
  return ref.replace(/^#\//, '').split('/')
    .reduce((node, part) => (node == null ? undefined : node[part]), root);
};

const resolveParam = (p, context) => (p && p.$ref ? resolveRef(p.$ref, context) : p);

const findQueryParameter = (parameters, parameterName, context) => (Array.isArray(parameters)
  ? parameters
    .map((p) => resolveParam(p, context))
    .find((p) => p && p.name === parameterName && p.in === 'query')
  : undefined);

const getParameterType = (param) => {
  if (!param) return undefined;
  if (param.schema && typeof param.schema === 'object') return param.schema.type;
  return param.type;
};

const PAGINATED_RESPONSE_CODE = '206';
const PAGINATED_RULE_CODES = ['OAR022', 'OAR025'];

const REQUIRED_PARAM_TYPES = { OAR025: 'integer' };

const hasResponseCode = (operation, code) => {
  const responses = operation && operation.responses;
  return !!responses && typeof responses === 'object'
    && Object.prototype.hasOwnProperty.call(responses, code);
};

/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options = {}, context) => {
  if (!given || typeof given !== 'object') return [];

  const ruleCode = context && context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'apq-collection-query-param-required';

  const parameterName = options.parameterName != null ? options.parameterName : options['parameter-name'];
  if (!parameterName) {
    return [{
      message: `${ruleCode}: "parameterName" functionOption is required.`,
      path: context.path,
    }];
  }

  const strategy = normalizeStrategy(options.pathValidationStrategy);

  const rawPaths = typeof options.paths === 'string' ? options.paths : DEFAULT_PATHS;
  const patterns = parsePathPatterns(rawPaths);

  const requiresPaginated = PAGINATED_RULE_CODES.includes(ruleCode);

  const results = [];

  Object.entries(given).forEach(([path, pathItem]) => {
    if (!pathItem || typeof pathItem !== 'object') return;

    const getOperation = pathItem.get;
    if (!getOperation || typeof getOperation !== 'object') return;

    if (PATH_PARAM_SUFFIX_REGEX.test(path)) return;
    if (!shouldIncludePath(path, patterns, strategy)) return;
    if (requiresPaginated && !hasResponseCode(getOperation, PAGINATED_RESPONSE_CODE)) return;

    const param = findQueryParameter(getOperation.parameters, parameterName, context);
    if (!param) {
      results.push({
        message: `${ruleCode}: ${parameterName} must be defined as a query parameter in this operation.`,
        path: [...context.path, path, 'get'],
      });
      return;
    }

    const expectedType = REQUIRED_PARAM_TYPES[ruleCode];
    if (expectedType && getParameterType(param) !== expectedType) {
      results.push({
        message: `${ruleCode}: ${parameterName} must be defined as a query parameter of type ${expectedType} in this operation.`,
        path: [...context.path, path, 'get'],
      });
    }
  });

  return results;
};
