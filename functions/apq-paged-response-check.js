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
const DEFAULT_PATHS = '/status,/health,/ping,**/me';

const SUCCESS_CODE_REGEX = /^2(\d\d|XX)$/i;
const NO_CONTENT_CODE = '204';
const MEDIA_TYPE_TOKEN = /^[a-z0-9!#$&^_.+-]+$/;

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

const isJsonMediaType = (mediaType) => {
  const essence = String(mediaType).split(';')[0].trim().toLowerCase();
  const parts = essence.split('/');
  if (parts.length !== 2 || parts[0] === '*') return true;
  const [type, subtype] = parts;
  if (!MEDIA_TYPE_TOKEN.test(type) || (subtype !== '*' && !MEDIA_TYPE_TOKEN.test(subtype))) return true;
  if (type === 'application' && (subtype === 'json' || subtype === '*')) return true;
  return subtype.endsWith('+json');
};

const pathPatterns = (raw) => {
  let items = [];
  if (raw === undefined) items = DEFAULT_PATHS.split(',');
  else if (typeof raw === 'string') items = raw.split(',');
  else if (Array.isArray(raw)) items = raw;
  return items
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((pattern) => pattern.split('/'));
};

const isIncludeStrategy = (value) => typeof value === 'string' && value.trim().replace(/^\//, '').toLowerCase() === 'include';

const matchesPattern = (pattern, segments) => {
  const match = (patternIndex, segmentIndex) => {
    if (patternIndex === pattern.length) return segmentIndex === segments.length;
    if (pattern[patternIndex] === '**') {
      for (let next = segmentIndex; next <= segments.length; next += 1) {
        if (match(patternIndex + 1, next)) return true;
      }
      return false;
    }
    if (segmentIndex === segments.length) return false;
    return (pattern[patternIndex] === '*' || pattern[patternIndex] === segments[segmentIndex]) && match(patternIndex + 1, segmentIndex + 1);
  };
  return match(0, 0);
};

const isDetailPath = (pathKey) => pathKey.slice(pathKey.lastIndexOf('/') + 1).startsWith('{');

const isUnresolvedRef = (value) => isObject(value) && typeof value.$ref === 'string';

const producedMediaTypes = (document, pathKey) => {
  const pathItem = isObject(document) && isObject(document.paths) ? document.paths[pathKey] : null;
  const operation = isObject(pathItem) ? pathItem.get : null;
  const listed = (value) => (Array.isArray(value) && value.length > 0 ? value : null);
  return listed(isObject(operation) ? operation.produces : null) || listed(isObject(document) ? document.produces : null);
};

const evaluatedSchemas = (response, responsePath, document, pathKey, isOas2) => {
  const schemas = [];
  const missing = [];
  if (isOas2) {
    const produces = producedMediaTypes(document, pathKey);
    if (produces && !produces.some(isJsonMediaType)) return { schemas, missing };
    if (isUnresolvedRef(response.schema)) return { schemas, missing };
    if (isObject(response.schema)) schemas.push({ schema: response.schema, path: [...responsePath, 'schema'] });
    else missing.push(responsePath);
    return { schemas, missing };
  }
  if (!isObject(response.content) || Object.keys(response.content).length === 0) {
    missing.push(isObject(response.content) ? [...responsePath, 'content'] : responsePath);
    return { schemas, missing };
  }
  Object.entries(response.content)
    .filter(([mediaTypeName]) => isJsonMediaType(mediaTypeName))
    .forEach(([mediaTypeName, mediaType]) => {
      const mediaTypePath = [...responsePath, 'content', mediaTypeName];
      if (isUnresolvedRef(mediaType) || (isObject(mediaType) && isUnresolvedRef(mediaType.schema))) return;
      if (isObject(mediaType) && isObject(mediaType.schema)) schemas.push({ schema: mediaType.schema, path: [...mediaTypePath, 'schema'] });
      else missing.push(mediaTypePath);
    });
  return { schemas, missing };
};

/**
 * @param {object} response - a resolved response of a GET operation
 * @param {object} options
 * @param {string|object} options['paging-schema'] - JSON string or object with the paging structure and its pagingPropertyName (default "paging")
 * @param {string|string[]} options.paths - comma-separated path patterns matched segment by segment; "*" matches one segment and "**" zero or more (default "/status,/health,/ping,**\/me")
 * @param {string} options.pathValidationStrategy - "/exclude" (default) skips the matching paths, "/include" only evaluates them
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (response, options = {}, context) => {
  if (!isObject(response) || isUnresolvedRef(response)) return [];
  const opts = options || {};

  const responsePath = context.path || [];
  const statusCode = String(responsePath[responsePath.length - 1]);
  if (!SUCCESS_CODE_REGEX.test(statusCode) || statusCode === NO_CONTENT_CODE) return [];

  const pathKey = typeof responsePath[1] === 'string' ? responsePath[1] : '';
  if (isDetailPath(pathKey)) return [];
  const segments = pathKey.split('/');
  const isListed = pathPatterns(opts.paths).some((pattern) => matchesPattern(pattern, segments));
  if (isIncludeStrategy(opts.pathValidationStrategy) ? !isListed : isListed) return [];

  const pagingSchema = parsePagingSchema(opts['paging-schema']);
  const pagingPropertyName = typeof pagingSchema.pagingPropertyName === 'string' && pagingSchema.pagingPropertyName.trim() !== ''
    ? pagingSchema.pagingPropertyName.trim()
    : DEFAULT_PAGING_PROPERTY;

  const rawDocument = context.document && context.document.data;
  const resolvedDocument = context.documentInventory && context.documentInventory.resolved;
  const document = isObject(resolvedDocument) ? resolvedDocument : rawDocument;
  const isOas2 = isObject(rawDocument) && typeof rawDocument.swagger === 'string';
  const ruleCode = context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR034';

  const results = [];
  const report = (message, path) => results.push({ message: `${ruleCode}: ${message}`, path });

  const { schemas, missing } = evaluatedSchemas(response, responsePath, document, pathKey, isOas2);
  missing.forEach((path) => report(`Collection response must define a schema with a '${pagingPropertyName}' property`, path));

  schemas.forEach(({ schema, path }) => {
    const view = buildView(schema, path);
    const paging = view.properties.get(pagingPropertyName);

    if (!paging) {
      if (isArrayView(view)) {
        report(`Collection response must be an object with a '${pagingPropertyName}' property, not a top-level array`, view.path);
      } else {
        report(`Collection response must include '${pagingPropertyName}' property for pagination`, view.path);
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
