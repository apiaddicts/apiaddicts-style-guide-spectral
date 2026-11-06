const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isContainer = (value) => value !== null && typeof value === 'object';
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const documentVersion = (root) => {
  if (has(root, 'swagger')) return 'v2';
  if (!has(root, 'openapi')) return null;
  const openapi = String(root.openapi).trim();
  if (openapi.startsWith('3.2')) return 'v32';
  if (openapi.startsWith('3.1')) return 'v31';
  return 'v3';
};

const decodePointerSegment = (segment) => {
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch (err) {
    decoded = segment;
  }
  return decoded.replace(/~1/g, '/').replace(/~0/g, '~');
};

/**
 * @param {object} root - The unresolved document (given: "$", resolved: false)
 * @param {object} options - unused, the rule has no parameters
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string|number>}>} one result per security requirement key that is not
 *   defined in securityDefinitions (Swagger 2.0) or components.securitySchemes (OpenAPI 3.x). The root security and the
 *   security of every operation are evaluated. Names are compared exactly and scopes are ignored. In OpenAPI 3.2 a key that is not a defined name and
 *   contains "#", ":" or "/" is a URI: a fragment of the document itself, optionally prefixed with $self, must point to an
 *   object, and a URI of another document is not evaluated.
 */
module.exports = (root, options, context) => {
  if (!isObject(root)) return [];
  const version = documentVersion(root);
  if (version === null) return [];

  const ruleCode = context && context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR080';
  const document = context && context.document;
  const inventory = context && context.documentInventory;
  const resolvedRoot = inventory && isContainer(inventory.resolved) ? inventory.resolved : undefined;
  const verbs = version === 'v32' ? VERBS_V32 : (version === 'v2' ? VERBS_V2 : VERBS_V3);

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
    const fragment = ref.slice(1);
    let target;
    if (fragment.startsWith('/')) {
      let value = root;
      const segments = [];
      for (const raw of fragment.slice(1).split('/')) {
        const key = decodePointerSegment(raw);
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
    const seen = new Set();
    let current = node;
    let currentPath = path;
    while (isObject(current) && typeof current.$ref === 'string') {
      const ref = current.$ref;
      holders.push({ node: current, path: currentPath });
      const target = ref.startsWith('#') && !seen.has(ref) ? pointerTarget(ref) : undefined;
      seen.add(ref);
      if (target === undefined) {
        const resolved = ref.startsWith('#') ? undefined : resolvedAt(logical);
        return { node: resolved, path: null, logical, external: { site: currentPath, visited: new Set() }, holders };
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

  const location = version === 'v2' ? 'securityDefinitions' : 'components.securitySchemes';
  const definitions = version === 'v2'
    ? root.securityDefinitions
    : (isObject(root.components) ? root.components.securitySchemes : undefined);
  const self = typeof root.$self === 'string' ? root.$self.trim() : '';
  const isDefined = (key) => {
    if (isObject(definitions) && has(definitions, key)) return true;
    if (version !== 'v32' || !/[#:/]/.test(key)) return false;
    const reference = self !== '' && key.startsWith(`${self}#`) ? key.slice(self.length) : key;
    if (!reference.startsWith('#')) return true;
    const target = pointerTarget(reference);
    return target !== undefined && isObject(target.value);
  };

  const results = [];
  const checkSecurity = (security) => {
    if (!Array.isArray(security.node)) return;
    security.node.forEach((entry, index) => {
      const requirement = enter(security, index);
      if (!isObject(requirement.node)) return;
      Object.keys(requirement.node).filter((key) => !isDefined(key)).forEach((key) => {
        results.push({
          message: `${ruleCode}: Security scheme '${key}' is not defined in ${location}.`,
          path: locatable(requirement.external ? requirement.external.site : [...requirement.path, key]),
        });
      });
    });
  };

  const visited = new Set();
  let visitPathItem;
  const checkOperation = (operation) => {
    const { node } = operation;
    if (!isObject(node)) return;
    const seen = operation.external ? operation.external.visited : visited;
    if (seen.has(node)) return;
    seen.add(node);
    checkSecurity(enter(operation, 'security'));
    if (version === 'v2') return;
    const callbacks = enter(operation, 'callbacks');
    if (!isObject(callbacks.node)) return;
    Object.keys(callbacks.node).forEach((name) => {
      const callback = enter(callbacks, name);
      if (!isObject(callback.node)) return;
      Object.keys(callback.node).filter((expression) => !expression.startsWith('x-')).forEach((expression) => visitPathItem(enter(callback, expression)));
    });
  };
  visitPathItem = (pathItem) => {
    const owners = pathItem.holders.map((holder) => ({ node: holder.node, path: holder.path, logical: pathItem.logical, external: null, holders: [] }));
    owners.push(pathItem);
    owners.filter((owner) => isObject(owner.node)).forEach((owner) => {
      verbs.forEach((verb) => checkOperation(enter(owner, verb)));
      if (version !== 'v32') return;
      const additional = enter(owner, 'additionalOperations');
      if (isObject(additional.node)) Object.keys(additional.node).forEach((method) => checkOperation(enter(additional, method)));
    });
  };

  checkSecurity(follow(root.security, ['security'], ['security'], null));
  const paths = follow(root.paths, ['paths'], ['paths'], null);
  if (isObject(paths.node)) {
    Object.keys(paths.node).filter((pathKey) => pathKey.startsWith('/')).forEach((pathKey) => visitPathItem(enter(paths, pathKey)));
  }
  if (version === 'v31' || version === 'v32') {
    const webhooks = follow(root.webhooks, ['webhooks'], ['webhooks'], null);
    if (isObject(webhooks.node)) Object.keys(webhooks.node).forEach((name) => visitPathItem(enter(webhooks, name)));
  }

  return results;
};
