/**
 * @param {string|string[]} targetVal
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  const patternStr = (options && options.pattern) || '^[a-zA-Z0-9_\\-., ]+$';
  const pattern = new RegExp(patternStr);
  const errors = [];
  const basePath = context.path || [];
  const buildMessage = (value) => `Value '${value}' does not match the required pattern: ${patternStr}.`;

  if (typeof targetVal === 'string') {
    if (!pattern.test(targetVal)) {
      errors.push({
        message: buildMessage(targetVal),
        path: basePath
      });
    }
  } else if (Array.isArray(targetVal)) {
    targetVal.forEach((role, index) => {
      if (typeof role === 'string' && !pattern.test(role)) {
        errors.push({
          message: buildMessage(role),
          path: [...basePath, index]
        });
      }
    });
  }

  return errors;
};