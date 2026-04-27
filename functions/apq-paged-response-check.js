module.exports = (schema, options = {}, context) => {
  const results = [];

  if (!schema || typeof schema !== 'object') {
    return results;
  }

  // Parse paging schema from options
  let pagingSchema = {};
  try {
    const pagingSchemaStr = options['paging-schema'] || defaultPagingSchema;
    pagingSchema = typeof pagingSchemaStr === 'string'
      ? JSON.parse(pagingSchemaStr)
      : pagingSchemaStr;
  } catch (err) {
    return [{
      message: `${context.rule.name.split(':').pop()}: Invalid paging-schema configuration: ${err.message}`,
      path: context.path,
    }];
  }

  const pagingPropertyName = pagingSchema.pagingPropertyName || 'paging';
  const requiredFields = pagingSchema.required || [];
  const properties = pagingSchema.properties || {};

  // Check if schema doesn't have properties at all - skip validation
  if (!schema.properties) {
    return results;
  }

  // Check if schema has the paging property
  if (!schema.properties[pagingPropertyName]) {
    // Only flag if schema looks like it should have paging (has data/items/results arrays)
    const hasArrayProperty = Object.values(schema.properties || {}).some(
      prop => prop && prop.type === 'array'
    );

    if (hasArrayProperty) {
      results.push({
        message: `${context.rule.name.split(':').pop()}: Response must include '${pagingPropertyName}' property for pagination`,
        path: context.path,
      });
    }
    return results;
  }

  const pagingObj = schema.properties[pagingPropertyName];

  // Validate paging object structure
  if (!pagingObj.properties) {
    results.push({
      message: `${context.rule.name.split(':').pop()}: '${pagingPropertyName}' must be an object with required properties`,
      path: [...context.path, 'properties', pagingPropertyName],
    });
    return results;
  }

  // Check required fields
  const missingFields = [];
  for (const requiredField of requiredFields) {
    if (!pagingObj.properties[requiredField]) {
      missingFields.push(requiredField);
    }
  }

  if (missingFields.length > 0) {
    results.push({
      message: `${context.rule.name.split(':').pop()}: Paging object must include required fields: ${missingFields.join(', ')}`,
      path: [...context.path, 'properties', pagingPropertyName, 'properties'],
    });
  }

  // Special validation for links object if it's required
  if (requiredFields.includes('links') && pagingObj.properties.links) {
    const linksObj = pagingObj.properties.links;
    if (linksObj.properties) {
      const requiredLinks = ['self', 'previous', 'next']; // From default schema
      const linksRequired = linksObj.required || [];

      for (const requiredLink of requiredLinks) {
        if (!linksObj.properties[requiredLink]) {
          results.push({
            message: `${context.rule.name.split(':').pop()}: Links object must include '${requiredLink}' property`,
            path: [...context.path, 'properties', pagingPropertyName, 'properties', 'links', 'properties'],
          });
        }
      }

      // Check if links has required array
      if (!linksRequired.includes('self') || !linksRequired.includes('previous') || !linksRequired.includes('next')) {
        results.push({
          message: `${context.rule.name.split(':').pop()}: Links object must require 'self', 'previous', and 'next'`,
          path: [...context.path, 'properties', pagingPropertyName, 'properties', 'links'],
        });
      }
    }
  }

  return results;
};

// Default paging schema matching Java implementation
const defaultPagingSchema = JSON.stringify({
  type: 'object',
  properties: {
    numPages: { type: 'integer' },
    total: { type: 'integer' },
    start: { type: 'integer' },
    limit: { type: 'integer' },
    links: {
      type: 'object',
      properties: {
        next: { type: 'object', properties: { href: { type: 'string' } } },
        previous: { type: 'object', properties: { href: { type: 'string' } } },
        last: { type: 'object', properties: { href: { type: 'string' } } },
        self: { type: 'object', properties: { href: { type: 'string' } } },
        first: { type: 'object', properties: { href: { type: 'string' } } },
      },
      required: ['self', 'previous', 'next'],
    },
  },
  required: ['start', 'limit', 'links'],
  pagingPropertyName: 'paging',
});
