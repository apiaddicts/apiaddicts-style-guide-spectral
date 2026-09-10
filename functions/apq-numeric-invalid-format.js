const VALID_INTEGER_FORMATS = new Set(['int32', 'int64']);
const VALID_NUMBER_FORMATS = new Set(['float', 'double']);

function getPrimaryType(type) {
  if (type === undefined || type === null) return null;
  if (Array.isArray(type)) {
    for (const element of type) {
      if (element === null || element === undefined) continue;
      const value = String(element);
      if (value !== 'null') return value;
    }
    return null;
  }
  if (typeof type === 'object') return null;
  return String(type);
}

function readFormat(node) {
  if (!Object.prototype.hasOwnProperty.call(node, 'format')) return { present: false, blank: false };
  const raw = node.format;
  if (raw === null || raw === undefined) return { present: false, blank: false };
  if (typeof raw === 'object') return { present: true, blank: true };
  const value = String(raw).trim();
  if (value === '') return { present: true, blank: true };
  return { present: true, blank: false, value };
}

const NON_SCHEMA_CONTAINERS = new Set(['example', 'examples', 'default', 'enum']);

function isInsideNonSchemaValue(path) {
  for (let i = 0; i < path.length; i += 1) {
    const segment = path[i];
    if (typeof segment !== 'string' || !NON_SCHEMA_CONTAINERS.has(segment)) continue;
    if (i > 0 && path[i - 1] === 'properties') continue;
    return true;
  }
  return false;
}

function isSwaggerResponseHeader(path) {
  const i = path.length - 2;
  return i >= 0 && path[i] === 'headers' && (i === 0 || path[i - 1] !== 'properties');
}

/**
 * @param {object} targetVal
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  if (!targetVal || typeof targetVal !== 'object') return [];
  if (isInsideNonSchemaValue(context.path) || isSwaggerResponseHeader(context.path)) return [];

  const type = getPrimaryType(targetVal.type);
  if (type !== 'integer' && type !== 'number') return [];

  const format = readFormat(targetVal);
  if (!format.present || format.blank) return [];

  const valid = type === 'integer' ? VALID_INTEGER_FORMATS : VALID_NUMBER_FORMATS;
  if (valid.has(format.value)) return [];

  return [{ message: context.rule.message, path: [...context.path, 'type'] }];
};
