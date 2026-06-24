const VALID_FORMATS = new Set([
  'date', 'date-time', 'password', 'byte', 'binary', 'email',
  'uuid', 'uri', 'hostname', 'ipv4', 'ipv6', 'hex', 'hex(16)',
  'json', 'xml', 'base64'
]);

module.exports = (targetVal, _options, context) => {
  const format = targetVal.format;
  if (format !== undefined && format !== null && !VALID_FORMATS.has(String(format).toLowerCase())) {
    return [{ message: context.rule.message }];
  }
  return [];
};
