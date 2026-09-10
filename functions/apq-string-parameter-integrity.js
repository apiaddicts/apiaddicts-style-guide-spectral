const DEFAULT_INTEGRITY = 'minLength,maxLength,pattern,enum';

function isStringType(type) {
  return type === 'string' || (Array.isArray(type) && type.indexOf('string') > -1);
}

/**
 * @param {object} targetVal a Parameter Object
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  if (!targetVal || typeof targetVal !== 'object') return [];

  const hasOwnType = Object.prototype.hasOwnProperty.call(targetVal, 'type');
  const isSwaggerBody = targetVal.in === 'body';
  const container = hasOwnType || isSwaggerBody ? targetVal : targetVal.schema;
  const containerPath = hasOwnType || isSwaggerBody ? context.path : [...context.path, 'schema'];
  if (!container || typeof container !== 'object') return [];

  if (!isStringType(container.type)) return [];

  const raw = options && options.parameter_integrity !== undefined && options.parameter_integrity !== null
    ? String(options.parameter_integrity)
    : DEFAULT_INTEGRITY;
  const checks = raw.split(',').map((key) => key.trim());

  const satisfied = checks.some((key) => {
    if (!Object.prototype.hasOwnProperty.call(container, key)) return false;
    return container[key] !== undefined && container[key] !== null;
  });
  if (satisfied) return [];

  return [{ message: context.rule.message, path: [...containerPath, 'type'] }];
};
