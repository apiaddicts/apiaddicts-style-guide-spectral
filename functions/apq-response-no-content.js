/**
 * @param {object} given - the 204 response object
 * @param {object} options - unused
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const doc = context.document?.data ?? {};
  const isOAP2 = typeof doc.swagger === 'string';
  const field = isOAP2 ? 'schema' : 'content';
  const value = given[field];

  const isEmpty = value === undefined || value === null
    || (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);

  if (isEmpty) {
    return [];
  }

  return [{
    message: 'OAR049: 204 No Content MUST NOT return any content.',
    path: [...(context.path || []), field],
  }];
};
