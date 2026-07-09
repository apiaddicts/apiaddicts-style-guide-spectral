const VALID_FORMATS = new Set([
  'date', 'date-time', 'password', 'byte', 'binary', 'email',
  'uuid', 'uri', 'hostname', 'ipv4', 'ipv6', 'hex', 'hex(16)',
  'json', 'xml', 'base64'
]);

function isValidPattern(pattern) {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = (targetVal, _options, context) => {
  const format = targetVal.format;
  if (format !== undefined && format !== null) {
    if (!VALID_FORMATS.has(String(format).toLowerCase())) {
      return [{ message: context.rule.message }];
    }
    return [];
  }

  const pattern = targetVal.pattern;
  if (pattern !== undefined && pattern !== null && String(pattern).length > 0 && isValidPattern(String(pattern))) {
    return [];
  }

  return [{ message: context.rule.message }];
};
