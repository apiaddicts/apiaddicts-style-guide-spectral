/**
 * @param {string|string[]} targetVal
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, _options, context) => {
  const pattern = /^[a-zA-Z0-9_\-., ]+$/;
  const errors = [];
  const basePath = context.path || [];

  if (typeof targetVal === 'string') {
    if (!pattern.test(targetVal)) {
      errors.push({
        message: context.rule.message,
        path: basePath
      });
    }
  } else if (Array.isArray(targetVal)) {
    targetVal.forEach((role, index) => {
      if (typeof role === 'string' && !pattern.test(role)) {
        errors.push({
          message: context.rule.message,
          path: [...basePath, index]
        });
      }
    });
  }

  return errors;
};