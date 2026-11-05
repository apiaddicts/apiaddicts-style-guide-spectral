const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);
const SCHEMA_KEYWORDS = ['additionalProperties', 'unevaluatedProperties', 'items', 'additionalItems', 'unevaluatedItems', 'contains', 'then', 'else'];
const SCHEMA_LIST_KEYWORDS = ['allOf', 'anyOf', 'oneOf', 'prefixItems', 'items'];
const SCHEMA_MAP_KEYWORDS = ['patternProperties', 'dependentSchemas'];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isContainer = (value) => value !== null && typeof value === 'object';
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isStackTraceName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '').includes('stacktrace');

const documentVersion = (root) => {
  if (has(root, 'swagger')) return 'v2';
  if (!has(root, 'openapi')) return null;
  const openapi = String(root.openapi).trim();
  if (openapi.startsWith('3.2')) return 'v32';
  if (openapi.startsWith('3.1')) return 'v31';
  return 'v3';
};

/**
 * @param {object} root - The unresolved document (given: "$", resolved: false)
 * @param {object} options - unused
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string|number>}>} one result per stack trace property declared by the schema
 *   of a response other than 200 of a path operation,
 *   looked up through properties and every subschema that describes the members of the body; a property is a stack trace when its name,
 *   lowercased and without non-alphanumeric characters, contains "stacktrace", and a false schema forbids
 *   it instead of declaring it. Local $refs are followed in the document, so each property is reported once on its own
 *   key; keywords next to a schema $ref count from OpenAPI 3.1; whatever an external $ref brings is read from the
 *   resolved document and reported on that $ref
 */
module.exports = (root, options, context) => {
  if (!isObject(root) || !isObject(root.paths)) return [];
  const version = documentVersion(root);
  if (version === null) return [];

  const ruleCode = context && context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR072';
  const document = context && context.document;
  const inventory = context && context.documentInventory;
  const resolvedRoot = inventory && isObject(inventory.resolved) ? inventory.resolved : undefined;
  const refSiblings = version === 'v31' || version === 'v32';

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

  const rawVisited = new Set();
  const follow = (node, path, logical, external) => {
    if (external) return { node, path: null, logical, external, holders: [] };
    const holders = [];
    const seen = new Set();
    let current = node;
    let currentPath = path;
    while (isObject(current) && typeof current.$ref === 'string') {
      const ref = current.$ref;
      holders.push({ node: current, path: currentPath });
      const target = ref.startsWith('#') && !seen.has(ref) ? pointerTarget(ref) : undefined;
      seen.add(ref);
      if (target === undefined) {
        return { node: resolvedAt(logical), path: null, logical, external: { site: currentPath, visited: new Set() }, holders };
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
    holders: [],
  });
  const enter = (cursor, key) => {
    const next = step(cursor, key);
    return follow(next.node, next.path, next.logical, next.external);
  };

  const results = [];
  const report = (cursor, name) => {
    results.push({
      message: `${ruleCode}: Responses other than 200 must not include the stack trace property '${name}'.`,
      path: locatable(cursor.external ? cursor.external.site : [...cursor.path, 'properties', name]),
    });
  };

  let walkSchema;
  const walkBody = (cursor) => {
    const { node } = cursor;
    if (!isObject(node)) return;
    const visited = cursor.external ? cursor.external.visited : rawVisited;
    if (visited.has(node)) return;
    visited.add(node);
    if (isObject(node.properties)) {
      const properties = step(cursor, 'properties');
      Object.keys(node.properties).forEach((name) => {
        if (isStackTraceName(name) && node.properties[name] !== false) report(cursor, name);
        walkSchema(enter(properties, name));
      });
    }
    SCHEMA_KEYWORDS.filter((keyword) => isObject(node[keyword])).forEach((keyword) => walkSchema(enter(cursor, keyword)));
    SCHEMA_LIST_KEYWORDS.filter((keyword) => Array.isArray(node[keyword])).forEach((keyword) => {
      const list = step(cursor, keyword);
      node[keyword].forEach((item, index) => walkSchema(enter(list, index)));
    });
    SCHEMA_MAP_KEYWORDS.filter((keyword) => isObject(node[keyword])).forEach((keyword) => {
      const map = step(cursor, keyword);
      Object.keys(node[keyword]).forEach((key) => walkSchema(enter(map, key)));
    });
  };
  walkSchema = (cursor) => {
    if (refSiblings) {
      cursor.holders.forEach((holder) => walkBody({ node: holder.node, path: holder.path, logical: cursor.logical, external: null, holders: [] }));
    }
    walkBody(cursor);
  };

  const operationsOf = (pathItem) => {
    const verbs = version === 'v32' ? VERBS_V32 : (version === 'v2' ? VERBS_V2 : VERBS_V3);
    const operations = verbs.map((verb) => enter(pathItem, verb));
    if (version === 'v32') {
      const additional = enter(pathItem, 'additionalOperations');
      if (isObject(additional.node)) operations.push(...Object.keys(additional.node).map((method) => enter(additional, method)));
    }
    return operations.filter((operation) => isObject(operation.node));
  };

  const paths = follow(root.paths, ['paths'], ['paths'], null);
  Object.keys(root.paths).filter((pathKey) => pathKey.startsWith('/')).forEach((pathKey) => {
    const pathItem = enter(paths, pathKey);
    if (!isObject(pathItem.node)) return;
    operationsOf(pathItem).forEach((operation) => {
      const responses = enter(operation, 'responses');
      if (!isObject(responses.node)) return;
      Object.keys(responses.node).filter((code) => code !== '200' && !code.startsWith('x-')).forEach((code) => {
        const response = enter(responses, code);
        if (!isObject(response.node)) return;
        if (version === 'v2') {
          walkSchema(enter(response, 'schema'));
          return;
        }
        const content = enter(response, 'content');
        if (!isObject(content.node)) return;
        Object.keys(content.node).forEach((mediaType) => {
          const media = enter(content, mediaType);
          if (!isObject(media.node)) return;
          walkSchema(enter(media, 'schema'));
          if (version === 'v32') walkSchema(enter(media, 'itemSchema'));
        });
      });
    });
  });

  return results;
};
