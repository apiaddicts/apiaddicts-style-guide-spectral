const MESSAGE = 'WSO2 scope definition does not exists';

const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);

const KIND_MAP = 2;
const KIND_SEQ = 3;
const KIND_ANCHOR_REF = 4;

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function documentVersion(root) {
  if (Object.prototype.hasOwnProperty.call(root, 'swagger')) return 'v2';
  const openapi = root.openapi;
  if (typeof openapi === 'string') {
    if (openapi.indexOf('3.2') === 0) return 'v32';
    if (openapi.indexOf('3.1') === 0) return 'v31';
  }
  return 'v3';
}

function surfaceFor(version) {
  return {
    verbs: version === 'v32' ? VERBS_V32 : (version === 'v2' ? VERBS_V2 : VERBS_V3),
    components: version !== 'v2',
    callbacks: version !== 'v2',
    webhooks: version === 'v31' || version === 'v32',
    pathItems: version === 'v31' || version === 'v32',
    additionalOperations: version === 'v32',
  };
}

function decodePointerSegment(segment) {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

function resolvePointer(root, ref) {
  if (typeof ref !== 'string' || ref.charAt(0) !== '#') return undefined;
  const pointer = ref.slice(1);
  if (pointer === '') return root;
  if (pointer.charAt(0) !== '/') return undefined;
  const segments = pointer.slice(1).split('/').map(decodePointerSegment);
  let value = root;
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (Array.isArray(value)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= value.length) return undefined;
      value = value[index];
    } else if (isPlainObject(value) && Object.prototype.hasOwnProperty.call(value, segment)) {
      value = value[segment];
    } else {
      return undefined;
    }
  }
  return value;
}

function resolveRef(root, value) {
  let current = value;
  const seenRefs = new Set();
  while (isPlainObject(current) && typeof current.$ref === 'string') {
    const ref = current.$ref;
    if (seenRefs.has(ref)) return current;
    seenRefs.add(ref);
    const target = resolvePointer(root, ref);
    if (target === undefined) return current;
    current = target;
  }
  return current;
}

function collectScopeNames(root) {
  const names = new Set();
  let security = root['x-wso2-security'];
  if (security !== undefined) security = resolveRef(root, security);
  if (!isPlainObject(security)) return names;
  const apim = security.apim;
  if (!isPlainObject(apim)) return names;
  const scopesContainer = apim['x-wso2-scopes'];
  let entries = [];
  if (isPlainObject(scopesContainer)) {
    entries = Object.keys(scopesContainer).map((key) => scopesContainer[key]);
  } else if (Array.isArray(scopesContainer)) {
    entries = scopesContainer.slice();
  }
  entries.forEach((entry) => {
    const resolved = resolveRef(root, entry);
    if (!isPlainObject(resolved)) return;
    const name = resolved.name;
    if (name === null || name === undefined) return;
    names.add(String(name));
  });
  return names;
}

function collectOperations(root, surface) {
  const operations = [];

  const visitOperation = (op, path) => {
    if (isPlainObject(op)) operations.push({ op, path });
  };

  const visitOperationWithCallbacks = (op, path) => {
    visitOperation(op, path);
    if (!surface.callbacks || !isPlainObject(op) || !isPlainObject(op.callbacks)) return;
    Object.keys(op.callbacks).forEach((expressionKey) => {
      if (expressionKey.charAt(0) === 'x') return;
      const callback = op.callbacks[expressionKey];
      if (!isPlainObject(callback)) return;
      Object.keys(callback).forEach((pathKey) => {
        if (pathKey.charAt(0) === 'x') return;
        // eslint-disable-next-line no-use-before-define
        visitPathItem(callback[pathKey], path.concat(['callbacks', expressionKey, pathKey]));
      });
    });
  };

  const visitPathItem = (pathItem, path) => {
    if (!isPlainObject(pathItem)) return;
    surface.verbs.forEach((verb) => {
      if (Object.prototype.hasOwnProperty.call(pathItem, verb)) {
        visitOperationWithCallbacks(pathItem[verb], path.concat([verb]));
      }
    });
    if (surface.additionalOperations && isPlainObject(pathItem.additionalOperations)) {
      Object.keys(pathItem.additionalOperations).forEach((method) => {
        visitOperationWithCallbacks(pathItem.additionalOperations[method], path.concat(['additionalOperations', method]));
      });
    }
  };

  if (isPlainObject(root.paths)) {
    Object.keys(root.paths).forEach((pathKey) => {
      if (pathKey.charAt(0) !== '/') return;
      visitPathItem(root.paths[pathKey], ['paths', pathKey]);
    });
  }

  if (surface.webhooks && isPlainObject(root.webhooks)) {
    Object.keys(root.webhooks).forEach((name) => {
      visitPathItem(root.webhooks[name], ['webhooks', name]);
    });
  }

  if (surface.components && isPlainObject(root.components)) {
    const components = root.components;
    if (surface.callbacks && isPlainObject(components.callbacks)) {
      Object.keys(components.callbacks).forEach((name) => {
        const callback = components.callbacks[name];
        if (!isPlainObject(callback)) return;
        Object.keys(callback).forEach((pathKey) => {
          if (pathKey.charAt(0) === 'x') return;
          visitPathItem(callback[pathKey], ['components', 'callbacks', name, pathKey]);
        });
      });
    }
    if (surface.pathItems && isPlainObject(components.pathItems)) {
      Object.keys(components.pathItems).forEach((name) => {
        visitPathItem(components.pathItems[name], ['components', 'pathItems', name]);
      });
    }
    if (surface.webhooks && isPlainObject(components.webhooks)) {
      Object.keys(components.webhooks).forEach((name) => {
        visitPathItem(components.webhooks[name], ['components', 'webhooks', name]);
      });
    }
  }

  return operations;
}

function unwrapAnchor(node) {
  let current = node;
  while (current && current.kind === KIND_ANCHOR_REF) {
    current = current.value;
  }
  return current;
}

function astNodeAt(root, path) {
  let node = unwrapAnchor(root);
  for (let i = 0; i < path.length; i += 1) {
    if (!node) return undefined;
    const segment = path[i];
    if (node.kind === KIND_MAP) {
      const mappings = node.mappings || [];
      let match = null;
      for (let j = mappings.length - 1; j >= 0; j -= 1) {
        const mapping = mappings[j];
        if (mapping.key && mapping.key.value === String(segment)) {
          match = mapping;
          break;
        }
      }
      if (!match) return undefined;
      node = unwrapAnchor(match.value);
    } else if (node.kind === KIND_SEQ) {
      const index = Number(segment);
      const items = node.items || [];
      if (!Number.isInteger(index) || index < 0 || index >= items.length) return undefined;
      node = unwrapAnchor(items[index]);
    } else {
      return undefined;
    }
  }
  return node;
}

function wasWrittenWithNoValue(context, path) {
  const parserResult = context && context.document && context.document.parserResult;
  const ast = parserResult && parserResult.ast;
  if (!ast || typeof ast.kind !== 'number') return false;
  return astNodeAt(ast, path) === null;
}

function issuePrefix(context) {
  const name = (context && context.rule && context.rule.name) || '';
  const code = name.indexOf(':') === -1 ? name : name.split(':').pop();
  return code ? `${code}: ` : '';
}

function tokenText(value) {
  if (Array.isArray(value)) return '[';
  if (isPlainObject(value)) return '{';
  return String(value);
}

function firstChildPath(scopePath, value) {
  if (Array.isArray(value) && value.length > 0) return scopePath.concat([0]);
  if (isPlainObject(value)) {
    const firstKey = Object.keys(value)[0];
    if (firstKey !== undefined) return scopePath.concat([firstKey]);
  }
  return scopePath;
}

/**
 * @param {object} given the whole raw document, since the rule is anchored with `given: "$"`
 * @param {null} _options OAR005 has no rule properties on either engine
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string|number>}>}
 */
module.exports = (given, _options, context) => {
  if (!isPlainObject(given)) return [];

  const version = documentVersion(given);
  const surface = surfaceFor(version);
  const definedScopes = collectScopeNames(given);
  const prefix = issuePrefix(context);
  const results = [];

  collectOperations(given, surface).forEach(({ op, path }) => {
    if (!Object.prototype.hasOwnProperty.call(op, 'x-scope')) return;
    const value = op['x-scope'];
    const scopePath = path.concat(['x-scope']);

    if (value === null) {
      if (wasWrittenWithNoValue(context, scopePath)) return;
      results.push({ message: `${prefix}${MESSAGE}`, path: scopePath });
      return;
    }

    if (!definedScopes.has(tokenText(value))) {
      results.push({ message: `${prefix}${MESSAGE}`, path: firstChildPath(scopePath, value) });
    }
  });

  return results;
};
