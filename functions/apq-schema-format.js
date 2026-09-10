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

const NON_SCHEMA_CONTAINERS = new Set(['example', 'examples', 'default', 'enum']);

function isNotASchemaNode(path) {
  for (let i = 0; i < path.length; i += 1) {
    const segment = path[i];
    if (typeof segment !== 'string' || !NON_SCHEMA_CONTAINERS.has(segment)) continue;
    if (i > 0 && path[i - 1] === 'properties') continue;
    return true;
  }
  const last = path.length - 2;
  return last >= 0 && path[last] === 'headers' && (last === 0 || path[last - 1] !== 'properties');
}

module.exports = (targetVal, _options, context) => {
  if (isNotASchemaNode(context.path)) {
    return [];
  }

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
