/**
 * @param {object} given - the 201 response object of a POST operation
 * @param {object} options - unused
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const doc = context.document?.data ?? {};
  const isOAP2 = typeof doc.swagger === 'string';
  const path = context.path || [];
  const message = 'OAR027: Location header is required in responses with code 201 from POST operations.';

  const headers = given.headers;
  const headerKey = headers && typeof headers === 'object'
    ? Object.keys(headers).find((key) => key.toLowerCase() === 'location')
    : undefined;

  if (!headerKey) {
    return [{ message, path: [...path, 'headers'] }];
  }

  const header = headers[headerKey];
  const type = isOAP2 ? header && header.type : header && header.schema && header.schema.type;

  if (!type) {
    const typePath = isOAP2
      ? [...path, 'headers', headerKey, 'type']
      : [...path, 'headers', headerKey, 'schema', 'type'];
    return [{ message, path: typePath }];
  }

  return [];
};
