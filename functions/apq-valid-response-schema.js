function mergedProperties(schema, visited) {
  const properties = {};
  if (!schema || typeof schema !== 'object' || visited.has(schema)) {
    return properties;
  }
  visited.add(schema);

  if (schema.properties && typeof schema.properties === 'object') {
    Object.assign(properties, schema.properties);
  }

  if (Array.isArray(schema.allOf)) {
    for (const subSchema of schema.allOf) {
      Object.assign(properties, mergedProperties(subSchema, visited));
    }
  }

  return properties;
}

/**
 * @param {object} given - the 201 response object of a POST operation
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const dataProperty = (options && options['data-property']) || 'data';
  const VALID_NAMES = [dataProperty, 'error'];
  const doc = context.document?.data ?? {};
  const isOAP2 = typeof doc.swagger === 'string';
  const basePath = context.path || [];
  const errors = [];

  const checkSchema = (schema, schemaPath) => {
    if (!schema || typeof schema !== 'object') {
      errors.push({
        message: `OAR038: 201 response must define a schema with a '${dataProperty}' or 'error' property.`,
        path: schemaPath,
      });
      return;
    }

    const properties = mergedProperties(schema, new WeakSet());
    const propNames = Object.keys(properties);

    if (propNames.length === 0) {
      errors.push({
        message: `OAR038: Response schema must have properties named '${dataProperty}' or 'error'.`,
        path: schemaPath,
      });
      return;
    }

    for (const propName of propNames) {
      if (!VALID_NAMES.includes(propName)) {
        errors.push({
          message: `OAR038: Response property must be named '${dataProperty}' or 'error'. Got '${propName}'.`,
          path: [...schemaPath, 'properties', propName],
        });
        continue;
      }
      const subProps = mergedProperties(properties[propName], new WeakSet());
      if (Object.keys(subProps).length === 0) {
        errors.push({
          message: `OAR038: Property '${propName}' must have at least one sub-property.`,
          path: [...schemaPath, 'properties', propName],
        });
      }
    }
  };

  if (isOAP2) {
    checkSchema(given.schema, [...basePath, 'schema']);
    return errors;
  }

  const content = given.content;
  if (content && typeof content === 'object' && Object.keys(content).length > 0) {
    for (const [mediaType, mediaObj] of Object.entries(content)) {
      checkSchema(mediaObj && mediaObj.schema, [...basePath, 'content', mediaType, 'schema']);
    }
    return errors;
  }

  checkSchema(given.schema, [...basePath, 'schema']);
  return errors;
};
