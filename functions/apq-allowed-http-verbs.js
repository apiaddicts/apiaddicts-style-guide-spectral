const HTTP_VERBS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

/**
 * @param {object} given
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const allowedVerbs = ((options && options['allowed-verbs']) || '')
    .split(',')
    .map((verb) => verb.trim().toLowerCase())
    .filter(Boolean);

  const basePath = context.path || [];
  const errors = [];

  HTTP_VERBS.forEach((verb) => {
    if (Object.prototype.hasOwnProperty.call(given, verb) && !allowedVerbs.includes(verb)) {
      errors.push({
        message: `HTTP verb '${verb}' is not encouraged. Only the following verbs are allowed: ${allowedVerbs.join(', ')}.`,
        path: [...basePath, verb]
      });
    }
  });

  return errors;
};
