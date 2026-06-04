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

    // Check if format is byte or binary
    const format = propSchema.format || '';
    if (format && format !== 'byte' && format !== 'binary') {
      results.push({
        message: context.rule.message
          .replace('{{property}}', propName)
          .replace('{{format}}', format || 'undefined'),
        path: [...context.path, 'properties', propName],
      });
    }
  });

  return results;
};
