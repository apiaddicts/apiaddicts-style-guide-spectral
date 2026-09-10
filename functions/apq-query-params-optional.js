const HTTP_VERBS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

// Guards against a cycle in a `$ref` chain (A -> B -> A).
const MAX_REF_DEPTH = 10;

// The `$ref` usage map depends only on the source document, so cache it per document instead of
// rebuilding it on every matched parameter.
const usageCache = new WeakMap();

const issue = () => [{ message: 'OAR060: All query parameter must be optional (required: false).' }];

function parseExclusions(value) {
  return new Set(
    String(value === undefined || value === null ? '' : value)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean),
  );
}

/**
 * Split a local JSON pointer (`#/components/parameters/Foo`) into its decoded segments.
 * Returns null for external refs and for anything that is not a document-local pointer.
 */
function refToSegments(ref) {
  if (typeof ref !== 'string' || !ref.startsWith('#/')) {
    return null;
  }
  return ref.slice(2).split('/').map((raw) => {
    let segment = raw;
    try {
      segment = decodeURIComponent(raw);
    } catch (e) {
      segment = raw;
    }
    return segment.replace(/~1/g, '/').replace(/~0/g, '~');
  });
}

function getAt(doc, segments) {
  return segments.reduce(
    (node, segment) => (node !== null && typeof node === 'object' ? node[segment] : undefined),
    doc,
  );
}

const keyOf = (segments) => JSON.stringify(segments);

/**
 * The two containers the rule's `given` scans for shared parameter definitions:
 * `components.parameters.<name>` (OpenAPI 3) and `parameters.<name>` (OpenAPI 2).
 */
function definitionSegments(path) {
  if (path[0] === 'components' && path[1] === 'parameters' && path.length >= 3) {
    return path.slice(0, 3);
  }
  if (path[0] === 'parameters' && path.length >= 2) {
    return path.slice(0, 2);
  }
  return null;
}

const isSharedDefinitionRef = (segments) => segments !== null
  && ((segments.length === 3 && segments[0] === 'components' && segments[1] === 'parameters')
    || (segments.length === 2 && segments[0] === 'parameters'));

/** Map of shared-definition pointer -> set of API paths that reference it through a `$ref`. */
function buildRefUsages(doc) {
  const usages = new Map();
  const paths = doc && typeof doc === 'object' ? doc.paths : undefined;
  if (!paths || typeof paths !== 'object') {
    return usages;
  }

  Object.keys(paths).forEach((apiPath) => {
    const pathItem = paths[apiPath];
    if (!pathItem || typeof pathItem !== 'object') {
      return;
    }

    const parameterLists = [pathItem.parameters];
    HTTP_VERBS.forEach((verb) => {
      const operation = pathItem[verb];
      if (operation && typeof operation === 'object') {
        parameterLists.push(operation.parameters);
      }
    });

    parameterLists.forEach((list) => {
      if (!Array.isArray(list)) {
        return;
      }
      list.forEach((parameter) => {
        let current = parameter;
        for (let depth = 0; depth < MAX_REF_DEPTH; depth += 1) {
          if (!current || typeof current !== 'object' || typeof current.$ref !== 'string') {
            break;
          }
          const segments = refToSegments(current.$ref);
          if (segments === null) {
            break;
          }
          const key = keyOf(segments);
          if (!usages.has(key)) {
            usages.set(key, new Set());
          }
          usages.get(key).add(apiPath);
          const next = getAt(doc, segments);
          if (!next || next === current) {
            break;
          }
          current = next;
        }
      });
    });
  });

  return usages;
}

function refUsagesFor(doc) {
  if (!doc || typeof doc !== 'object') {
    return new Map();
  }
  let cached = usageCache.get(doc);
  if (cached === undefined) {
    cached = buildRefUsages(doc);
    usageCache.set(doc, cached);
  }
  return cached;
}

/**
 * True when the match landed on a `$ref` to a shared definition the rule also scans on its own —
 * either a use site under `paths`, or one shared definition aliasing another.
 *
 * Spectral runs the rule over the resolved document, so it matches such a parameter once here and
 * once at the definition it points to. Reporting is left to the definition-site match, which is
 * also the only place Sonar reports it (its AST visits the definition, never the use sites).
 */
function isRefToSharedDefinition(source, path) {
  const parameterPath = path[path.length - 1] === 'required' ? path.slice(0, -1) : path;
  const node = getAt(source, parameterPath);
  if (!node || typeof node !== 'object' || typeof node.$ref !== 'string') {
    return false;
  }
  return isSharedDefinitionRef(refToSegments(node.$ref));
}

module.exports = (targetVal, options = {}, context = {}) => {
  const exclusions = parseExclusions((options || {})['path-exclusions']);
  const path = (context && context.path) || [];
  const source = context && context.document ? context.document.data : undefined;

  if (isRefToSharedDefinition(source, path)) {
    return [];
  }

  if (path[0] === 'paths') {
    const apiPath = path.find((p) => typeof p === 'string' && p.startsWith('/'));
    if (apiPath && exclusions.has(apiPath)) {
      return [];
    }
  } else if (exclusions.size > 0) {
    // A shared definition has no path of its own: the AST/JSONPath match lands on
    // `components.parameters.<name>` (or `parameters.<name>` in OpenAPI 2). Exclude it only when
    // every path that references it is excluded — an unreferenced definition stays in scope.
    const definition = definitionSegments(path);
    const usages = definition === null
      ? undefined
      : refUsagesFor(source).get(keyOf(definition));
    if (usages !== undefined && usages.size > 0 && [...usages].every((u) => exclusions.has(u))) {
      return [];
    }
  }

  if (targetVal === true || targetVal === 'true') {
    return issue();
  }

  return [];
};
