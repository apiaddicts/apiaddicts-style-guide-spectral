/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */

const BODY_ALLOWED_METHODS = new Set(['post', 'put', 'patch']);

function hasMediaTypes(list) {
  return Array.isArray(list) && list.length > 0;
}

module.exports = (given, options, context) => {
  const errors = [];
  if (!given) return errors;

  const root = context.document.parserResult.data;

  if (root.swagger) {
    if (given.responses === undefined) return errors;

    const method = context.path[context.path.length - 1];
    if (!BODY_ALLOWED_METHODS.has(method)) return errors;

    if (!hasMediaTypes(given.produces) && !hasMediaTypes(root.produces)) {
      errors.push({
        message: context.rule.message,
        path: [...context.path]
      });
    }

    return errors;
  }

  if (given.responses !== undefined) return errors;

  const contentTypes = given.content ? Object.keys(given.content) : [];
  if (contentTypes.length === 0) {
    errors.push({
      message: context.rule.message,
      path: [...context.path]
    });
  }

  return errors;
};
