/**
 * @param {object} given - The operation node ($.paths[*][*])
 * @param {object} options - Function options ({ 'response-code': '401' | '403' | ... })
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  const results = [];

  if (!given || typeof given !== 'object') {
    return results;
  }

  const responses = given.responses;
  if (!responses || typeof responses !== 'object') {
    return results;
  }

  const expectedCode = (options && options['response-code'])
    ? String(options['response-code'])
    : '401';

  // Check if this operation has security defined
  const operationHasSecurity = given.security &&
    Array.isArray(given.security) &&
    given.security.length > 0;

  // Check if there's global security in the document
  let globalHasSecurity = false;
  try {
    const rootSecurity = context.document?.parserResult?.data?.security;
    globalHasSecurity = rootSecurity &&
      Array.isArray(rootSecurity) &&
      rootSecurity.length > 0;
  } catch (e) {
    // Ignore errors accessing root security
  }

  if (operationHasSecurity || globalHasSecurity) {
    if (!responses[expectedCode]) {
      results.push({
        message: context.rule.message,
        path: [...context.path, 'responses']
      });
    }
  }

  return results;
};
