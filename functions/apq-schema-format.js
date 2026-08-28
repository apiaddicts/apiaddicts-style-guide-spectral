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
  const typePath = [...context.path, 'type'];

  const type = targetVal.type;
  const isStringType = type === 'string' || (Array.isArray(type) && type.includes('string'));
  if (!isStringType) {
    return [];
  }

  const format = targetVal.format;
  if (format !== undefined && format !== null) {
    if (!VALID_FORMATS.has(String(format).toLowerCase())) {
      return [{ message: context.rule.message, path: typePath }];
    }
    return [];
  }

  const enumValues = targetVal.enum;
  if (Array.isArray(enumValues) && enumValues.length > 0) {
    return [];
  }

  const pattern = targetVal.pattern;
  if (pattern !== undefined && pattern !== null && String(pattern).length > 0 && isValidPattern(String(pattern))) {
    return [];
  }

  return [{ message: context.rule.message, path: typePath }];
};
