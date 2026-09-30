const DEFAULT_PAGING_SCHEMA = {
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
};

const DEFAULT_PAGING_PROPERTY = 'paging';

const COLLECTION_PROPERTY_NAMES = ['data', 'items', 'results', 'content', 'elements', 'records', 'entries', 'values', 'list', 'rows', 'payload'];

const SUCCESS_CODE_REGEX = /^2(\d\d|XX)$/i;
const NO_CONTENT_CODE = '204';
const DETAIL_PATH_REGEX = /\/\{[^}]+\}$/;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const parsePagingSchema = (raw) => {
  if (isObject(raw)) return raw;
  if (typeof raw !== 'string' || raw.trim() === '') return DEFAULT_PAGING_SCHEMA;
  try {
    const parsed = JSON.parse(raw);
    return isObject(parsed) ? parsed : DEFAULT_PAGING_SCHEMA;
  } catch (err) {
    return DEFAULT_PAGING_SCHEMA;
  }
};

const declaredTypes = (schema) => {
  if (!isObject(schema)) return [];
  if (typeof schema.type === 'string') return [schema.type];
  if (Array.isArray(schema.type)) return schema.type.filter((t) => typeof t === 'string');
  return [];
};

const isNullSchema = (schema) => {
  const types = declaredTypes(schema);
  return types.length > 0 && types.every((t) => t === 'null');
};

const unwrapNullable = (schema, schemaPath) => {
  let current = schema;
  let currentPath = schemaPath;
  const seen = new Set();
  while (isObject(current) && !seen.has(current)) {
    seen.add(current);
    const key = ['oneOf', 'anyOf'].find((k) => Array.isArray(current[k]));
    if (!key || current.properties || current.items || current.allOf) break;
    const branches = current[key].map((branch, index) => ({ branch, index })).filter(({ branch }) => !isNullSchema(branch));
    if (branches.length !== 1) break;
    currentPath = [...currentPath, key, branches[0].index];
    current = branches[0].branch;
  }
  return { schema: current, path: currentPath };
};

const buildView = (schema, schemaPath) => {
  const root = unwrapNullable(schema, schemaPath);
  const view = {
    types: new Set(),
    properties: new Map(),
    required: new Set(),
    items: null,
    path: root.path,
    rootSchema: root.schema,
    propertiesPath: null,
    requiredPath: null,
  };
  const visited = new Set();

  const collect = (node, nodePath) => {
    const unwrapped = unwrapNullable(node, nodePath);
    const current = unwrapped.schema;
    const currentPath = unwrapped.path;
    if (!isObject(current) || visited.has(current)) return;
    visited.add(current);

    declaredTypes(current).filter((t) => t !== 'null').forEach((t) => view.types.add(t));

    if (isObject(current.properties)) {
      if (!view.propertiesPath) view.propertiesPath = [...currentPath, 'properties'];
      Object.entries(current.properties).forEach(([name, propertySchema]) => {
        if (!view.properties.has(name)) {
          view.properties.set(name, { schema: propertySchema, path: [...currentPath, 'properties', name] });
        }
      });
    }

    if (Array.isArray(current.required)) {
      if (!view.requiredPath) view.requiredPath = [...currentPath, 'required'];
      current.required.filter((name) => typeof name === 'string').forEach((name) => view.required.add(name));
    }

    if (isObject(current.items) && !view.items) {
      view.items = { schema: current.items, path: [...currentPath, 'items'] };
    }

    if (Array.isArray(current.allOf)) {
      current.allOf.forEach((member, index) => collect(member, [...currentPath, 'allOf', index]));
    }
  };

  collect(root.schema, root.path);

  if (view.types.size === 0) {
    if (view.properties.size > 0) view.types.add('object');
    else if (view.items) view.types.add('array');
  }
  return view;
};

const expectedType = (template) => {
  const types = declaredTypes(template).filter((t) => t !== 'null' && t !== 'any');
  if (types.length > 0) return types[0];
  if (isObject(template.properties) || Array.isArray(template.required)) return 'object';
  if (isObject(template.items)) return 'array';
  return null;
};

const typeMatches = (expected, actualTypes) => {
  if (!expected || actualTypes.size === 0) return true;
  if (actualTypes.has(expected)) return true;
  return expected === 'number' && actualTypes.has('integer');
};

const isArrayView = (view) => view.types.has('array');

const typePath = (view) => (isObject(view.rootSchema) && view.rootSchema.type !== undefined ? [...view.path, 'type'] : view.path);

const findCollectionProperty = (view) => {
  for (const [name, property] of view.properties) {
    if (COLLECTION_PROPERTY_NAMES.includes(name.toLowerCase()) && isArrayView(buildView(property.schema, property.path))) {
      return name;
    }
  }
  return null;
};

const validateAgainstTemplate = (template, view, label, report) => {
  if (!isObject(template)) return;
  const type = expectedType(template);

  if (type === 'array') {
    if (isObject(template.items) && view.items) {
      validateAgainstTemplate(template.items, buildView(view.items.schema, view.items.path), `${label}[]`, report);
    }
    return;
  }
  if (type !== 'object') return;

  const requiredNames = Array.isArray(template.required) ? template.required.filter((name) => typeof name === 'string') : [];
  const missing = requiredNames.filter((name) => !view.properties.has(name));
  const notMarked = requiredNames.filter((name) => view.properties.has(name) && !view.required.has(name));

  if (missing.length > 0) {
    report(`'${label}' must include required properties: ${missing.join(', ')}`, view.propertiesPath || view.path);
  }
  if (notMarked.length > 0) {
    report(`'${label}' must list as required: ${notMarked.join(', ')}`, view.requiredPath || view.path);
  }

  if (!isObject(template.properties)) return;
  Object.entries(template.properties).forEach(([name, childTemplate]) => {
    const property = view.properties.get(name);
    if (!property || !isObject(childTemplate)) return;
    const childView = buildView(property.schema, property.path);
    const childType = expectedType(childTemplate);
    if (!typeMatches(childType, childView.types)) {
      report(`'${label}.${name}' must be of type ${childType}`, typePath(childView));
      return;
    }
    validateAgainstTemplate(childTemplate, childView, `${label}.${name}`, report);
  });
};

const responseSchemas = (response, responsePath, isOas2) => {
  if (isOas2) {
    return isObject(response.schema) ? [{ schema: response.schema, path: [...responsePath, 'schema'] }] : [];
  }
  if (!isObject(response.content)) return [];
  return Object.entries(response.content)
    .filter(([, mediaType]) => isObject(mediaType) && isObject(mediaType.schema))
    .map(([mediaTypeName, mediaType]) => ({ schema: mediaType.schema, path: [...responsePath, 'content', mediaTypeName, 'schema'] }));
};

/**
 * @param {object} response - a resolved response of a GET operation
 * @param {object} options - { 'paging-schema': JSON string or object }
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (response, options = {}, context) => {
  if (!isObject(response)) return [];

  const responsePath = context.path || [];
  const statusCode = String(responsePath[responsePath.length - 1]);
  if (!SUCCESS_CODE_REGEX.test(statusCode) || statusCode === NO_CONTENT_CODE) return [];

  const pathKey = typeof responsePath[1] === 'string' ? responsePath[1] : '';
  const isDetailPath = DETAIL_PATH_REGEX.test(pathKey);

  const pagingSchema = parsePagingSchema((options || {})['paging-schema']);
  const pagingPropertyName = typeof pagingSchema.pagingPropertyName === 'string' && pagingSchema.pagingPropertyName.trim() !== ''
    ? pagingSchema.pagingPropertyName.trim()
    : DEFAULT_PAGING_PROPERTY;

  const document = context.document && context.document.data;
  const isOas2 = isObject(document) && typeof document.swagger === 'string';
  const ruleCode = context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR034';

  const results = [];
  const report = (message, path) => results.push({ message: `${ruleCode}: ${message}`, path });

  responseSchemas(response, responsePath, isOas2).forEach(({ schema, path }) => {
    const view = buildView(schema, path);
    const paging = view.properties.get(pagingPropertyName);

    if (!paging) {
      if (isDetailPath) return;
      if (isArrayView(view)) {
        report(`Collection response must be an object with a '${pagingPropertyName}' property, not a top-level array`, view.path);
        return;
      }
      const collectionProperty = findCollectionProperty(view);
      if (collectionProperty) {
        report(`Response with collection property '${collectionProperty}' must include '${pagingPropertyName}' property for pagination`, view.path);
      }
      return;
    }

    const pagingView = buildView(paging.schema, paging.path);
    if (!typeMatches('object', pagingView.types)) {
      report(`'${pagingPropertyName}' must be of type object`, typePath(pagingView));
      return;
    }
    validateAgainstTemplate(pagingSchema, pagingView, pagingPropertyName, report);
  });

  return results;
};
