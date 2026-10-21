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

function parseList(value) {
  let items = [];
  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === 'string') {
    items = value.split(',');
  }
  const names = items
    .filter((item) => typeof item === 'string' || typeof item === 'number')
    .map((item) => String(item).trim())
    .filter(Boolean);
  return [...new Set(names)];
}

function formatNames(names) {
  const quoted = names.map((name) => `'${name}'`);
  if (quoted.length <= 1) {
    return quoted.join('');
  }
  return `${quoted.slice(0, -1).join(', ')} or ${quoted[quoted.length - 1]}`;
}

function isIncludeStrategy(value) {
  return typeof value === 'string' && value.trim().replace(/^\//, '').toLowerCase() === 'include';
}

/**
 * @param {object} given - the 201 response object of a POST operation
 * @param {object} options
 * @param {string} options['data-property'] - name accepted next to 'error' when allowed-properties is not set (default "data")
 * @param {string|string[]} options['allowed-properties'] - top-level property names accepted in the schema, array or comma-separated; blank falls back to [data-property, 'error']
 * @param {string|string[]} options['required-properties'] - top-level property names that must be present, array or comma-separated
 * @param {string|string[]} options.paths - paths to include/exclude (exact match), array or comma-separated
 * @param {string} options.pathValidationStrategy - "/include" or "/exclude" (default "/exclude")
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  if (!given || typeof given !== 'object') {
    return [];
  }

  const opts = options || {};
  const basePath = context.path || [];

  const paths = parseList(opts.paths);
  const isListed = paths.includes(basePath[1]);
  if (isIncludeStrategy(opts.pathValidationStrategy) ? !isListed : isListed) {
    return [];
  }

  const dataProperty = opts['data-property'] || 'data';
  const configuredNames = parseList(opts['allowed-properties']);
  const allowedNames = configuredNames.length > 0 ? configuredNames : [...new Set([dataProperty, 'error'])];
  const requiredNames = parseList(opts['required-properties']);
  const allowedText = formatNames(allowedNames);
  const doc = context.document?.data ?? {};
  const isOAP2 = typeof doc.swagger === 'string';
  const errors = [];

  const checkSchema = (schema, schemaPath) => {
    if (!schema || typeof schema !== 'object') {
      errors.push({
        message: `OAR038: 201 response must define a schema with a ${allowedText} property.`,
        path: schemaPath,
      });
      return;
    }

    const properties = mergedProperties(schema, new WeakSet());
    const propNames = Object.keys(properties);

    if (propNames.length === 0) {
      errors.push({
        message: `OAR038: Response schema must have properties named ${allowedText}.`,
        path: schemaPath,
      });
      return;
    }

    for (const propName of propNames) {
      if (!allowedNames.includes(propName)) {
        errors.push({
          message: `OAR038: Response property must be named ${allowedText}. Got '${propName}'.`,
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

    for (const requiredName of requiredNames) {
      if (!Object.prototype.hasOwnProperty.call(properties, requiredName)) {
        errors.push({
          message: `OAR038: Response schema must define the required property '${requiredName}'.`,
          path: schemaPath,
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
