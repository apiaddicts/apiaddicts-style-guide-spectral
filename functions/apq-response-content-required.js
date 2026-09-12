/**
 * @param {object} given - the response object (e.g. responses['201'])
 * @param {object} options - unused
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const doc = (context.document
    && context.document.parserResult
    && context.document.parserResult.data) || {};
  const field = doc.swagger ? 'schema' : 'content';
  const value = given[field];

  const isEmpty = value === undefined || value === null
    || (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);

  if (isEmpty) {
    return [{ message: context.rule.message }];
  }
  return [];
};
