/**
 * @param {object} given - The operation node ($.paths[*][*])
 * @param {object} options - Function options ({ 'expected-codes': '401' | '403' | '401,403' | ... })
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

  const raw = (options && options['expected-codes']) || '401';
  const expectedCodes = (Array.isArray(raw) ? raw : String(raw).split(','))
    .map((code) => String(code).trim())
    .filter(Boolean);

  const operationSecurityDefined = Array.isArray(given.security);
  if (operationSecurityDefined && given.security.length === 0) {
    return results;
  }

  // Check if this operation has security defined
  const operationHasSecurity = operationSecurityDefined && given.security.length > 0;

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

  if (!(operationHasSecurity || globalHasSecurity)) {
    return results;
  }

  const ruleName = (context.rule && context.rule.name) || '';
  const oarId = ruleName.includes(':') ? ruleName.split(':').pop() : ruleName;
  const prefix = oarId ? `${oarId}: ` : '';

  expectedCodes.forEach((code) => {
    if (!responses[code]) {
      results.push({
        message: `${prefix}Response code ${code} must be defined for operations with security schemes defined.`,
        path: [...context.path, 'responses'],
      });
    }
  });

  return results;
};
