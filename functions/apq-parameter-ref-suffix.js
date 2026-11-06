const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);
const DEFAULT_SUFFIX = 'Param';

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

const resolveUri = (base, reference) => {
  if (/^[a-z][a-z0-9+.-]*:/i.test(reference) || reference.startsWith('/')) return reference;
  const segments = base.split('/').slice(0, -1);
  reference.split('/').forEach((segment) => {
    if (segment === '..') {
      if (segments.length > 1) segments.pop();
    } else if (segment !== '.') {
      segments.push(segment);
    }
  });
  return segments.join('/');
};

/**
 * @param {object} root - The unresolved document (given: "$", resolved: false)
 * @param {object} options - default-suffix: the text every parameter $ref must end with (default "Param"), compared
 *   literally and case-sensitively against the whole $ref; a missing or blank value falls back to the default
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string|number>}>} one result per parameter $ref that does not end with the
 *   suffix. The parameters of every path item and operation in paths, callbacks (3.x), webhooks and components.pathItems
 *   (3.1+), components.callbacks (3.x), OpenAPI 3.2 query and additionalOperations, and the entries of
 *   components.parameters (3.x) or parameters (2.0), are evaluated. $refs of path items, callbacks, operations,
 *   parameter lists and parameters are followed, so every hop of a chained parameter $ref is checked. Each $ref is
 *   reported once where it is written; a $ref written in another file is reported on the $ref of the document that
 *   brings that file.
 */
module.exports = (root, options, context) => {
  if (!isObject(root)) return [];
  const version = documentVersion(root);
  if (version === null) return [];

  const configured = options && typeof options['default-suffix'] === 'string' ? options['default-suffix'].trim() : '';
  const suffix = configured === '' ? DEFAULT_SUFFIX : configured;
  const ruleCode = context && context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR088';
  const document = context && context.document;
  const inventory = context && context.documentInventory;
  const rootSource = inventory && typeof inventory.source === 'string' ? inventory.source : null;
  const referenced = inventory && isObject(inventory.referencedDocuments) ? inventory.referencedDocuments : {};
  const self = version === 'v32' && typeof root.$self === 'string' ? root.$self.trim() : '';
  const verbs = version === 'v32' ? VERBS_V32 : (version === 'v2' ? VERBS_V2 : VERBS_V3);

  const locatable = (path) => {
    if (!document || typeof document.getRangeForJsonPath !== 'function') return path;
    for (let length = path.length; length > 0; length -= 1) {
      if (document.getRangeForJsonPath(path.slice(0, length), false) !== undefined) return path.slice(0, length);
    }
    return path;
  };

  const normalized = (source) => {
    try {
      return decodeURI(source).toLowerCase();
    } catch (err) {
      return source.toLowerCase();
    }
  };
  const isRoot = (source) => source === null || source === rootSource || (rootSource !== null && normalized(source) === normalized(rootSource));
  const documentData = (source) => {
    if (isRoot(source)) return root;
    if (has(referenced, source)) return referenced[source] && referenced[source].data;
    const key = Object.keys(referenced).find((candidate) => normalized(candidate) === normalized(source));
    return key === undefined ? undefined : referenced[key] && referenced[key].data;
  };

  const target = (cursor, ref) => {
    const hash = ref.indexOf('#');
    const uri = hash === -1 ? ref : ref.slice(0, hash);
    const fragment = hash === -1 ? '' : ref.slice(hash + 1);
    let source = cursor.source;
    if (uri !== '' && !(cursor.source === rootSource && self !== '' && uri === self)) {
      if (cursor.source === null) return undefined;
      source = resolveUri(cursor.source, uri);
    }
    let value = documentData(source);
    if (value === undefined) return undefined;
    const segments = [];
    if (fragment !== '' && fragment !== '/') {
      if (!fragment.startsWith('/')) return undefined;
      for (const raw of fragment.slice(1).split('/')) {
        const key = decodePointerSegment(raw);
        const segment = Array.isArray(value) && /^(0|[1-9]\d*)$/.test(key) ? Number(key) : key;
        if (!isContainer(value) || !has(value, segment)) return undefined;
        value = value[segment];
        segments.push(segment);
      }
    }
    const inRoot = isRoot(source);
    return {
      node: value,
      path: segments,
      source: inRoot ? rootSource : source,
      site: inRoot ? null : (cursor.site || [...cursor.path, '$ref']),
    };
  };

  const follow = (cursor) => {
    const holders = [];
    const seen = new Set();
    let current = cursor;
    while (isObject(current.node) && typeof current.node.$ref === 'string') {
      holders.push(current);
      const key = `${current.source}#${JSON.stringify(current.path)}`;
      if (seen.has(key)) return { ...current, node: undefined, holders };
      seen.add(key);
      const next = target(current, current.node.$ref);
      if (next === undefined) return { ...current, node: undefined, holders };
      current = next;
    }
    return { ...current, holders };
  };
  const enter = (cursor, key) => follow({
    node: isContainer(cursor.node) && has(cursor.node, key) ? cursor.node[key] : undefined,
    path: [...cursor.path, key],
    source: cursor.source,
    site: cursor.site,
  });

  const results = [];
  const reported = new Set();
  const report = (holder) => {
    const ref = holder.node.$ref;
    if (ref.endsWith(suffix)) return;
    const path = holder.site || [...holder.path, '$ref'];
    const key = `${JSON.stringify(path)}|${holder.source}|${JSON.stringify(holder.path)}`;
    if (reported.has(key)) return;
    reported.add(key);
    results.push({ message: `${ruleCode}: The parameter $ref '${ref}' must end with the suffix '${suffix}'.`, path: locatable(path) });
  };

  const checkParameter = (cursor) => follow(cursor).holders.forEach(report);
  const checkParameters = (owner) => {
    const parameters = enter(owner, 'parameters');
    if (!Array.isArray(parameters.node)) return;
    parameters.node.forEach((entry, index) => checkParameter({
      node: entry,
      path: [...parameters.path, index],
      source: parameters.source,
      site: parameters.site,
    }));
  };

  const visited = new Map();
  const firstVisit = (cursor) => {
    const key = `${JSON.stringify(cursor.site)}|${cursor.source}`;
    if (!visited.has(key)) visited.set(key, new Set());
    const nodes = visited.get(key);
    if (nodes.has(cursor.node)) return false;
    nodes.add(cursor.node);
    return true;
  };

  let visitPathItem;
  const visitCallback = (callback) => {
    if (!isObject(callback.node) || !firstVisit(callback)) return;
    Object.keys(callback.node).filter((expression) => !expression.startsWith('x-')).forEach((expression) => visitPathItem(enter(callback, expression)));
  };
  const visitOperation = (operation) => {
    if (!isObject(operation.node) || !firstVisit(operation)) return;
    checkParameters(operation);
    if (version === 'v2') return;
    const callbacks = enter(operation, 'callbacks');
    if (isObject(callbacks.node)) Object.keys(callbacks.node).forEach((name) => visitCallback(enter(callbacks, name)));
  };
  visitPathItem = (pathItem) => {
    [...pathItem.holders, pathItem].filter((owner) => isObject(owner.node) && firstVisit(owner)).forEach((owner) => {
      checkParameters(owner);
      verbs.forEach((verb) => visitOperation(enter(owner, verb)));
      if (version !== 'v32') return;
      const additional = enter(owner, 'additionalOperations');
      if (isObject(additional.node)) Object.keys(additional.node).forEach((method) => visitOperation(enter(additional, method)));
    });
  };

  const start = { node: root, path: [], source: rootSource, site: null };
  const each = (cursor, filter, visit) => {
    if (isObject(cursor.node)) Object.keys(cursor.node).filter(filter).forEach((key) => visit(enter(cursor, key)));
  };
  const any = () => true;

  each(enter(start, 'paths'), (key) => key.startsWith('/'), visitPathItem);
  if (version === 'v2') {
    each(enter(start, 'parameters'), any, (parameter) => parameter.holders.forEach(report));
    return results;
  }
  const components = enter(start, 'components');
  if (version === 'v31' || version === 'v32') {
    each(enter(start, 'webhooks'), any, visitPathItem);
    each(enter(components, 'pathItems'), any, visitPathItem);
  }
  each(enter(components, 'callbacks'), any, visitCallback);
  each(enter(components, 'parameters'), any, (parameter) => parameter.holders.forEach(report));

  return results;
};
