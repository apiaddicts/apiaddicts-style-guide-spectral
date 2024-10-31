// options:
//   except: 'array<string>'
//   schema: object

const { schema } = require('@stoplight/spectral-functions');

/**
 * @param {Array<string>} given
 * @param {object} options
 * @param {Array<string>} options.except
 * @param {object} options.schema
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  const result = [];
  const paths = given || [];
  if (paths.length === 0) return result;
  if (options.except.includes(String(context.path[1]))) return result;

  return schema(given, { schema: options.schema }, context);
};
