const DEFAULT_RESPONSE_SCHEMA = '{"type":"object","properties":{"status":{"type":"object","properties":{"code":{"type":"integer"},"description":{"type":"string"},"internal_code":{"type":"string"},"errors":{"type":"array","nullable":true,"items":{"type":"object","properties":{"name":{"type":"string"},"value":{"type":"string"}}}}},"required":["code"]},"payload":{"type":"any"}},"required":["status","payload"]}';
const DEFAULT_PATH_EXCLUSIONS = '/status';

const TYPE_ANY = '*';
const OPERATIONS = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

const MESSAGES = {
  propertyMissing: (name) => `'${name}' property is missing`,
  propertyWrongType: (name, type) => `'${name}' must be of type ${type}`,
  propertyItemsMissing: (name) => `'${name}' items are missing`,
  propertyItemsWrongType: (name, type) => `'${name}' items must be of type ${type}`,
  requiredProperties: (fields) => `The following fields must be required: ${fields}`,
  requiredOneProperty: () => 'At least one property must be defined',
};

function isType(type, name) {
  if (name === TYPE_ANY) return true;
  if (type === undefined || type === null) return false;
  if (Array.isArray(type)) return type.some((element) => String(element) === name);
  return String(type) === name;
}

function typeOf(node) {
  return node && typeof node === 'object' ? node.type : undefined;
}

function getAllProperties(schema, basePath) {
  const properties = new Map();
  if (!schema || typeof schema !== 'object') return properties;

  if (schema.properties && typeof schema.properties === 'object') {
    Object.keys(schema.properties).forEach((name) => {
      properties.set(name, {
        value: schema.properties[name],
        path: [...basePath, 'properties', name],
      });
    });
  }

  if (Array.isArray(schema.allOf)) {
    schema.allOf.forEach((member, index) => {
      getAllProperties(member, [...basePath, 'allOf', index]).forEach((entry, name) => {
        properties.set(name, entry);
      });
    });
  }

  return properties;
}

function matchesTypeViaAllOf(node, expectedType) {
  if (!node || !Array.isArray(node.allOf)) return false;
  return node.allOf.some((member) => member && typeof member === 'object' && isType(member.type, expectedType));
}

function declaredTypeOf(declared) {
  let type = declared && typeof declared === 'object' && typeof declared.type === 'string'
    ? declared.type.trim()
    : '';
  if (type === '' || type === 'any') type = TYPE_ANY;
  if (type === TYPE_ANY && declared && typeof declared === 'object' && declared.properties) type = 'object';
  return type;
}

function createValidator(config, ruleCode) {
  const results = [];

  const push = (path, text) => results.push({ message: `${ruleCode}: ${text}`, path });

  function validateProperty(properties, propertyName, propertyType, parentPath) {
    const entry = properties.get(propertyName);
    if (!entry) {
      push(parentPath, MESSAGES.propertyMissing(propertyName));
      return null;
    }
    const { value, path } = entry;
    if (isType(typeOf(value), propertyType)) return entry;
    if (matchesTypeViaAllOf(value, propertyType)) return entry;

    const hasType = typeOf(value) !== undefined;
    push(hasType ? [...path, 'type'] : path, MESSAGES.propertyWrongType(propertyName, propertyType));
    return null;
  }

  function validateRequiredProperties(schema, schemaPath, requiredValues) {
    const declared = schema && typeof schema === 'object' ? schema.required : undefined;
    const present = new Set(Array.isArray(declared) ? declared.map(String) : []);
    if (requiredValues.every((name) => present.has(name))) return;
    push(
      Array.isArray(declared) ? [...schemaPath, 'required'] : schemaPath,
      MESSAGES.requiredProperties(requiredValues.join(', ')),
    );
  }

  function validateItems(entry, propertyName, itemsType) {
    const { value, path } = entry;
    if (!isType(typeOf(value), 'array')) return null;

    const items = value.items;
    if (items === undefined || items === null) {
      push(path, MESSAGES.propertyItemsMissing(propertyName));
      return null;
    }
    const itemsPath = [...path, 'items'];
    if (!isType(typeOf(items), itemsType)) {
      push(
        typeOf(items) === undefined ? itemsPath : [...itemsPath, 'type'],
        MESSAGES.propertyItemsWrongType(propertyName, itemsType),
      );
      return null;
    }
    return { value: items, path: itemsPath };
  }

  function validateObject(declaredSchema, entry) {
    const declaredProperties = declaredSchema && typeof declaredSchema === 'object'
      ? declaredSchema.properties
      : null;
    if (declaredProperties && typeof declaredProperties === 'object') {
      Object.keys(declaredProperties).sort().forEach((child) => {
        validateProperties(child, declaredProperties[child], entry);
      });
    }

    const declaredRequired = declaredSchema && typeof declaredSchema === 'object'
      ? declaredSchema.required
      : null;
    if (Array.isArray(declaredRequired) && declaredRequired.length > 0) {
      const required = [...new Set(declaredRequired.map(String))].sort();
      validateRequiredProperties(entry.value, entry.path, required);
    }
  }

  function validateArray(declaredSchema, entry, propertyName) {
    const declaredItems = declaredSchema && typeof declaredSchema === 'object' ? declaredSchema.items : null;
    const itemsType = declaredTypeOf(declaredItems);

    if (itemsType === 'object') {
      const items = validateItems(entry, propertyName, itemsType);
      if (items) validateObject(declaredItems, items);
      return;
    }
    if (itemsType === 'array') {
      const items = validateItems(entry, propertyName, itemsType);
      if (items) validateArray(declaredItems, items, propertyName);
      return;
    }
    validateItems(entry, propertyName, itemsType);
  }

  function validateProperties(propertyName, declaredSchema, containerEntry) {
    const propertyMap = getAllProperties(containerEntry.value, containerEntry.path);
    const schemaType = declaredTypeOf(declaredSchema);

    if (schemaType === 'object') {
      const entry = validateProperty(propertyMap, propertyName, 'object', containerEntry.path);
      if (entry) validateObject(declaredSchema, entry);
      return;
    }
    if (schemaType === 'array') {
      const entry = validateProperty(propertyMap, propertyName, 'array', containerEntry.path);
      if (entry) validateArray(declaredSchema, entry, propertyName);
      return;
    }
    validateProperty(propertyMap, propertyName, schemaType, containerEntry.path);
  }

  function validateDataProperty(name, declaredSchema, properties, parentEntry) {
    let type = declaredSchema && typeof declaredSchema === 'object' && typeof declaredSchema.type === 'string'
      ? declaredSchema.type
      : TYPE_ANY;
    if (type === 'any') type = TYPE_ANY;

    const entry = validateProperty(properties, name, type, parentEntry.path);
    if (!entry) return;

    const parentIsArray = isType(typeOf(parentEntry.value), 'array');
    if (getAllProperties(entry.value, entry.path).size === 0 && !parentIsArray) {
      push(entry.path, MESSAGES.requiredOneProperty());
    }
  }

  function validateRootProperties(requiredNames, properties, parentEntry) {
    if (!Array.isArray(requiredNames) || requiredNames.length === 0) return;
    requiredNames.map(String).forEach((name) => {
      const declaredSchema = config.properties && Object.prototype.hasOwnProperty.call(config.properties, name)
        ? config.properties[name]
        : null;
      if (name === config.dataProperty) {
        validateDataProperty(name, declaredSchema, properties, parentEntry);
      } else {
        validateProperties(name, declaredSchema, parentEntry);
      }
    });
  }

  function resolveRootNode(properties, schemaEntry) {
    let rootProperty = config.rootProperty;
    if (rootProperty === TYPE_ANY) {
      const first = properties.keys().next();
      if (first.done) return null;
      rootProperty = first.value;
    }

    const rootEntry = validateProperty(properties, rootProperty, 'object', schemaEntry.path);
    if (rootEntry && getAllProperties(rootEntry.value, rootEntry.path).size === 0) {
      push(rootEntry.path, MESSAGES.requiredOneProperty());
    }
    return rootEntry;
  }

  function visitSchemaNode(schemaEntry, statusCode) {
    let successCode = false;
    let code = 0;
    if (String(statusCode).toLowerCase() !== 'default') {
      code = Number.parseInt(String(statusCode), 10);
      if (Number.isNaN(code)) return;
      successCode = code >= 200 && code < 300 && code !== 204;
    }
    if (code === 204) return;

    let entry = schemaEntry;
    let properties = getAllProperties(entry.value, entry.path);

    if (config.rootProperty !== null) {
      const rootEntry = resolveRootNode(properties, entry);
      if (!rootEntry) return;
      entry = rootEntry;
      properties = getAllProperties(rootEntry.value, rootEntry.path);
    }

    validateRootProperties(successCode ? config.requiredOnSuccess : config.requiredOnError, properties, entry);
    validateRootProperties(config.requiredAlways, properties, entry);
  }

  return { results, visitSchemaNode };
}

function parseConfig(options) {
  const raw = options && options['response-schema'] !== undefined && options['response-schema'] !== null
    ? options['response-schema']
    : DEFAULT_RESPONSE_SCHEMA;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return {
    requiredOnSuccess: Array.isArray(parsed.requiredOnSuccess) ? parsed.requiredOnSuccess : null,
    requiredOnError: Array.isArray(parsed.requiredOnError) ? parsed.requiredOnError : null,
    requiredAlways: Array.isArray(parsed.requiredAlways) ? parsed.requiredAlways : null,
    properties: parsed.properties && typeof parsed.properties === 'object' ? parsed.properties : null,
    dataProperty: typeof parsed.dataProperty === 'string' ? parsed.dataProperty : null,
    rootProperty: typeof parsed.rootProperty === 'string' ? parsed.rootProperty : null,
  };
}

/**
 * @param {object} targetVal the Paths Object
 * @param {object} options
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (targetVal, options, context) => {
  if (!targetVal || typeof targetVal !== 'object') return [];

  const ruleCode = context.rule.name.split(':').pop();

  let config;
  try {
    config = parseConfig(options);
  } catch (err) {
    return [{ message: `${ruleCode}: Error parsing Standard Response Schemas`, path: context.path }];
  }

  const rawExclusions = options && options['path-exclusions'] !== undefined && options['path-exclusions'] !== null
    ? String(options['path-exclusions'])
    : DEFAULT_PATH_EXCLUSIONS;
  const exclusions = new Set(rawExclusions.split(',').map((item) => item.trim()));

  const validator = createValidator(config, ruleCode);

  Object.keys(targetVal).forEach((pathName) => {
    if (exclusions.has(pathName)) return;
    const pathItem = targetVal[pathName];
    if (!pathItem || typeof pathItem !== 'object') return;

    Object.keys(pathItem).forEach((operationName) => {
      if (!OPERATIONS.has(operationName.toLowerCase())) return;
      const operation = pathItem[operationName];
      if (!operation || typeof operation !== 'object') return;
      const { responses } = operation;
      if (!responses || typeof responses !== 'object') return;

      Object.keys(responses).forEach((statusCode) => {
        const response = responses[statusCode];
        if (!response || typeof response !== 'object') return;
        const responsePath = [...context.path, pathName, operationName, 'responses', statusCode];

        if (response.content && typeof response.content === 'object') {
          Object.keys(response.content).forEach((mediaType) => {
            if (!mediaType.toLowerCase().includes('json')) return;
            const mediaTypeNode = response.content[mediaType];
            if (!mediaTypeNode || typeof mediaTypeNode !== 'object') return;
            const { schema } = mediaTypeNode;
            if (schema === undefined || schema === null) return;
            validator.visitSchemaNode(
              { value: schema, path: [...responsePath, 'content', mediaType, 'schema'] },
              statusCode,
            );
          });
          return;
        }

        const { schema } = response;
        if (schema === undefined || schema === null) return;
        validator.visitSchemaNode({ value: schema, path: [...responsePath, 'schema'] }, statusCode);
      });
    });
  });

  return validator.results;
};
