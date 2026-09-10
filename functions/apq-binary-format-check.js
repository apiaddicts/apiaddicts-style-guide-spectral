module.exports = (schema, options = {}, context) => {
  const results = [];

  if (!schema || typeof schema !== 'object') {
    return results;
  }

  const fieldsToCheck = (options['fields-to-apply'] || 'product,line,price')
    .split(',')
    .map(f => f.trim().toLowerCase());

  const properties = schema.properties || {};

  Object.entries(properties).forEach(([propName, propSchema]) => {
    if (!fieldsToCheck.includes(propName.toLowerCase())) {
      return;
    }

    if (!propSchema || typeof propSchema !== 'object') {
      return;
    }

    const type = propSchema.type;
    const isStringType = type === 'string' || (Array.isArray(type) && type.includes('string'));
    if (!isStringType) {
      return;
    }

    const format = propSchema.format || '';
    const hasBinaryFormat = format === 'byte' || format === 'binary';
    const hasContentEncoding = propSchema.contentEncoding !== undefined
      || propSchema.contentMediaType !== undefined;
    if (!hasBinaryFormat && !hasContentEncoding) {
      results.push({
        message: `OAR082: Property '${propName}' must define a 'byte' or 'binary' format (currently: ${format || 'missing'}).`,
        path: [...context.path, 'properties', propName, 'type'],
      });
    }
  });

  return results;
};
