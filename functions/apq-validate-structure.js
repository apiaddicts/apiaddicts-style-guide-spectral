/**
 * @param {string} given  - The field value
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (given === null || given === undefined) return [];

  const VALID_IN_VALUES = ['query', 'header', 'path', 'cookie', 'body', 'formData'];
  const VALID_SCHEMA_TYPES = ['string', 'number', 'integer', 'boolean', 'array', 'object', 'null'];

  const nodePath = context.path || [];
  const fieldName = nodePath[nodePath.length - 1];

  if (fieldName === 'in') {
    if (!VALID_IN_VALUES.includes(String(given))) {
      return [{
        message: `in: Expected one of [${VALID_IN_VALUES.map(v => `"${v}"`).join(', ')}]`,
      }];
    }
  }

  if (fieldName === 'type') {
    if (!VALID_SCHEMA_TYPES.includes(String(given))) {
      return [{
        message: `type: Expected one of [${VALID_SCHEMA_TYPES.map(v => `"${v}"`).join(', ')}]`,
      }];
    }
  }

  return [];
};
