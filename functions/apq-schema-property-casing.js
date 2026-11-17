const DEFAULT_CONVENTION = 'camelCase';

const NAMING_REGEX = {
  snake_case: /^[a-z0-9_$]+$/,
  'kebab-case': /^[a-z0-9-]+$/,
  camelCase: /^[a-z0-9]+(?:[A-Z][a-z0-9]+)*[A-Z]?$/,
  UpperCamelCase: /^[0-9]*(?:[A-Z][a-z0-9]+)*[A-Z]?$/
};

const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);
const SCHEMA_KEYWORDS = ['additionalProperties', 'unevaluatedProperties', 'items', 'additionalItems', 'unevaluatedItems', 'contains', 'propertyNames', 'not', 'if', 'then', 'else'];
const SCHEMA_LIST_KEYWORDS = ['allOf', 'anyOf', 'oneOf', 'prefixItems', 'items'];
const SCHEMA_MAP_KEYWORDS = ['patternProperties', 'dependentSchemas'];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isContainer = (value) => value !== null && typeof value === 'object';
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isExtension = (key) => key.startsWith('x-');

const documentVersion = (root) => {
  if (has(root, 'swagger')) return 'v2';
  if (!has(root, 'openapi')) return null;
  const openapi = String(root.openapi).trim();
  if (openapi.startsWith('3.2')) return 'v32';
  if (openapi.startsWith('3.1')) return 'v31';
  return 'v3';
};

const resolveConvention = (options) => {
  const option = isObject(options) ? options['naming-convention'] : undefined;
  if (typeof option !== 'string') return DEFAULT_CONVENTION;
  const wanted = option.trim().toLowerCase();
  return Object.keys(NAMING_REGEX).find((name) => name.toLowerCase() === wanted) || DEFAULT_CONVENTION;
};

/**
 * @param {object} root - The unresolved document (given: "$", resolved: false)
 * @param {object} options
 * @param {string} options['naming-convention'] camelCase (default), snake_case, kebab-case or UpperCamelCase, trimmed and
 *   case-insensitive; any other value falls back to camelCase
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string|number>}>} one result per property name that does not follow the
 *   casing, in every schema of a request body or a response: Swagger 2.0 body parameters and response schemas, and the
 *   media type schemas (and 3.2 itemSchema) of request bodies and responses of every operation, callback and webhook.
 */
module.exports = (root, options, context) => {
  if (!isObject(root)) return [];
  const version = documentVersion(root);
  if (version === null) return [];

  const convention = resolveConvention(options);
  const regex = NAMING_REGEX[convention];
  const document = context && context.document;
  const inventory = context && context.documentInventory;
  const resolvedRoot = inventory && isObject(inventory.resolved) ? inventory.resolved : undefined;
  const refSiblings = version === 'v31' || version === 'v32';
  const isV3 = version !== 'v2';
  const self = version === 'v32' && typeof root.$self === 'string' ? root.$self.trim() : '';
  const localPointer = (ref) => {
    if (ref.startsWith('#')) return ref;
    return self !== '' && ref.startsWith(`${self}#`) ? ref.slice(self.length) : null;
  };

  const locatable = (path) => {
    if (!document || typeof document.getRangeForJsonPath !== 'function') return path;
    for (let length = path.length; length > 0; length -= 1) {
      if (document.getRangeForJsonPath(path.slice(0, length), false) !== undefined) return path.slice(0, length);
    }
    return path;
  };

  const targets = new Map();
  const pointerTarget = (ref) => {
    if (targets.has(ref)) return targets.get(ref);
    let fragment = ref.slice(1);
    try {
      fragment = decodeURIComponent(fragment);
    } catch (err) {
      fragment = ref.slice(1);
    }
    let target;
    if (fragment.startsWith('/')) {
      let value = root;
      const segments = [];
      for (const raw of fragment.slice(1).split('/')) {
        const key = raw.replace(/~1/g, '/').replace(/~0/g, '~');
        const segment = Array.isArray(value) && /^(0|[1-9]\d*)$/.test(key) ? Number(key) : key;
        if (!isContainer(value) || !has(value, segment)) {
          value = undefined;
          break;
        }
        value = value[segment];
        segments.push(segment);
      }
      if (value !== undefined) target = { value, segments };
    }
    targets.set(ref, target);
    return target;
  };

  const resolvedAt = (logical) => logical.reduce((value, key) => (isContainer(value) && has(value, key) ? value[key] : undefined), resolvedRoot);

  const follow = (node, path, logical, external) => {
    if (external) return { node, path: null, logical, external, holders: [] };
    const holders = [];
    const seenRefs = new Set();
    let current = node;
    let currentPath = path;
    while (isObject(current) && typeof current.$ref === 'string') {
      const ref = localPointer(current.$ref);
      holders.push({ node: current, path: currentPath });
      const target = ref !== null && !seenRefs.has(ref) ? pointerTarget(ref) : undefined;
      seenRefs.add(ref);
      if (target === undefined) {
        return { node: resolvedAt(logical), path: null, logical, external: { site: currentPath, visited: new Map() }, holders };
      }
      current = target.value;
      currentPath = target.segments;
    }
    return { node: current, path: currentPath, logical, external: null, holders };
  };
  const step = (cursor, key) => ({
    node: isContainer(cursor.node) && has(cursor.node, key) ? cursor.node[key] : undefined,
    path: cursor.external ? null : [...cursor.path, key],
    logical: [...cursor.logical, key],
    external: cursor.external,
    holders: []
  });
  const enter = (cursor, key) => {
    const next = step(cursor, key);
    return follow(next.node, next.path, next.logical, next.external);
  };
  const start = (key) => follow(root[key], [key], [key], null);

  const rawVisited = new Map();
  const firstVisit = (cursor, kind) => {
    const visited = cursor.external ? cursor.external.visited : rawVisited;
    if (!visited.has(kind)) visited.set(kind, new Set());
    const nodes = visited.get(kind);
    if (nodes.has(cursor.node)) return false;
    nodes.add(cursor.node);
    return true;
  };

  const results = [];
  const reported = new Set();
  const checkName = (cursor, name) => {
    if (name === '' || regex.test(name)) return;
    const path = locatable(cursor.external ? [...cursor.external.site, '$ref'] : [...cursor.path, 'properties', name]);
    const id = JSON.stringify(path);
    if (reported.has(id)) return;
    reported.add(id);
    results.push({ message: `Property name "${name}" must follow the ${convention} naming convention`, path });
  };

  const eachKey = (cursor, visit) => {
    if (!isObject(cursor.node)) return;
    Object.keys(cursor.node).forEach((key) => visit(enter(cursor, key)));
  };
  const eachItem = (cursor, visit) => {
    if (!Array.isArray(cursor.node)) return;
    cursor.node.forEach((item, index) => visit(enter(cursor, index)));
  };

  let walkSchema;
  const walkSchemaBody = (cursor) => {
    const { node } = cursor;
    if (!isObject(node) || !firstVisit(cursor, 'schema')) return;
    if (isObject(node.properties)) {
      const properties = step(cursor, 'properties');
      Object.keys(node.properties).forEach((name) => {
        if (node.properties[name] === false) return;
        checkName(cursor, name);
        walkSchema(enter(properties, name));
      });
    }
    SCHEMA_KEYWORDS.filter((keyword) => isObject(node[keyword])).forEach((keyword) => walkSchema(enter(cursor, keyword)));
    SCHEMA_LIST_KEYWORDS.filter((keyword) => Array.isArray(node[keyword])).forEach((keyword) => eachItem(step(cursor, keyword), walkSchema));
    SCHEMA_MAP_KEYWORDS.filter((keyword) => isObject(node[keyword])).forEach((keyword) => eachKey(step(cursor, keyword), walkSchema));
    if (refSiblings && isObject(node.$defs)) eachKey(step(cursor, '$defs'), walkSchema);
  };
  walkSchema = (cursor) => {
    if (refSiblings) {
      cursor.holders.forEach((holder) => walkSchemaBody({ node: holder.node, path: holder.path, logical: cursor.logical, external: null, holders: [] }));
    }
    walkSchemaBody(cursor);
  };

  const walkMediaType = (cursor) => {
    if (!isObject(cursor.node) || !firstVisit(cursor, 'media')) return;
    walkSchema(enter(cursor, 'schema'));
    if (version === 'v32') walkSchema(enter(cursor, 'itemSchema'));
  };
  const walkContent = (cursor) => eachKey(cursor, walkMediaType);

  const walkBodyParameter = (cursor) => {
    if (!isObject(cursor.node) || cursor.node.in !== 'body' || !firstVisit(cursor, 'parameter')) return;
    walkSchema(enter(cursor, 'schema'));
  };
  const walkResponse = (cursor) => {
    if (!isObject(cursor.node) || !firstVisit(cursor, 'response')) return;
    if (isV3) walkContent(step(cursor, 'content'));
    else walkSchema(enter(cursor, 'schema'));
  };
  const walkRequestBody = (cursor) => {
    if (!isObject(cursor.node) || !firstVisit(cursor, 'requestBody')) return;
    walkContent(step(cursor, 'content'));
  };

  let walkPathItem;
  const walkCallback = (cursor) => {
    if (!isObject(cursor.node) || !firstVisit(cursor, 'callback')) return;
    Object.keys(cursor.node).filter((key) => !isExtension(key)).forEach((key) => walkPathItem(enter(cursor, key)));
  };
  const walkOperation = (cursor) => {
    if (!isObject(cursor.node) || !firstVisit(cursor, 'operation')) return;
    if (!isV3) eachItem(step(cursor, 'parameters'), walkBodyParameter);
    const responses = enter(cursor, 'responses');
    if (isObject(responses.node)) {
      Object.keys(responses.node).filter((code) => !isExtension(code)).forEach((code) => walkResponse(enter(responses, code)));
    }
    if (!isV3) return;
    walkRequestBody(enter(cursor, 'requestBody'));
    eachKey(step(cursor, 'callbacks'), walkCallback);
  };
  walkPathItem = (cursor) => {
    if (!isObject(cursor.node) || !firstVisit(cursor, 'pathItem')) return;
    if (!isV3) eachItem(step(cursor, 'parameters'), walkBodyParameter);
    const verbs = version === 'v32' ? VERBS_V32 : (version === 'v2' ? VERBS_V2 : VERBS_V3);
    verbs.forEach((verb) => walkOperation(enter(cursor, verb)));
    if (version === 'v32') eachKey(step(cursor, 'additionalOperations'), walkOperation);
  };

  if (isObject(root.paths)) {
    const paths = start('paths');
    Object.keys(root.paths).filter((key) => key.startsWith('/')).forEach((key) => walkPathItem(enter(paths, key)));
  }
  if (refSiblings && isObject(root.webhooks)) {
    const webhooks = start('webhooks');
    Object.keys(root.webhooks).filter((key) => !isExtension(key)).forEach((key) => walkPathItem(enter(webhooks, key)));
  }

  return results;
};
