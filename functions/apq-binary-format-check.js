module.exports = (schema, options = {}, context) => {
  const results = [];

  if (!schema || typeof schema !== 'object') {
    return results;
  }

  // Fields that must have byte or binary format
  const fieldsToCheck = (options['fields-to-apply'] || 'product,line,price')
    .split(',')
    .map(f => f.trim().toLowerCase());

  const properties = schema.properties || {};

  Object.entries(properties).forEach(([propName, propSchema]) => {
    // Only check if this property is in our list
    if (!fieldsToCheck.includes(propName.toLowerCase())) {
      return;
    }

    // Check if it's a string type
    if (propSchema.type !== 'string') {
      return;
    }

    const format = propSchema.format || '';
    if (format !== 'byte' && format !== 'binary') {
      results.push({
        message: `OAR082: Property '${propName}' must define a 'byte' or 'binary' format (currently: ${format || 'missing'}).`,
        path: [...context.path, 'properties', propName, 'type'],
      });
    }
  });

  return results;
};
