const DEFAULT_ALLOWED_FLOWS = 'authorizationCode,clientCredentials';
const DEFAULT_PATHS = '/me,/health,/ping,/status';
const FLOW_ALIASES = { accesscode: 'authorizationcode', application: 'clientcredentials' };

const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const documentVersion = (root) => {
  if (has(root, 'swagger')) return 'v2';
  if (!has(root, 'openapi')) return null;
  const openapi = String(root.openapi).trim();
  if (openapi.startsWith('3.2')) return 'v32';
  if (openapi.startsWith('3.1')) return 'v31';
  return 'v3';
};

const flowKey = (name) => {
  const key = name.trim().toLowerCase();
  return FLOW_ALIASES[key] || key;
};

const allowedFlows = (raw) => {
  let items = [];
  if (typeof raw === 'string') items = raw.split(',');
  else if (Array.isArray(raw)) items = raw.filter((item) => typeof item === 'string').flatMap((item) => item.split(','));
  const names = new Map();
  items.map((item) => item.trim()).filter(Boolean).forEach((item) => {
    if (!names.has(flowKey(item))) names.set(flowKey(item), item);
  });
  return names.size > 0 ? names : allowedFlows(DEFAULT_ALLOWED_FLOWS);
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

const pointerTarget = (root, ref) => {
  let fragment;
  try {
    fragment = decodeURIComponent(ref.slice(1));
  } catch (err) {
    return undefined;
  }
  if (!fragment.startsWith('/')) return undefined;
  const segments = fragment.slice(1).split('/').map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
  let value = root;
  for (const segment of segments) {
    if (!isObject(value) || !has(value, segment)) return undefined;
    value = value[segment];
  }
  return isObject(value) ? { value, segments } : undefined;
};

const collectOperations = (root, version) => {
  const verbs = version === 'v32' ? VERBS_V32 : (version === 'v2' ? VERBS_V2 : VERBS_V3);
  const operations = [];
  const visitPathItem = (pathItem, pathKey, ancestors) => {
    if (!isObject(pathItem) || ancestors.has(pathItem)) return;
    const chain = new Set(ancestors).add(pathItem);
    const ops = verbs.filter((verb) => has(pathItem, verb)).map((verb) => pathItem[verb]);
    if (version === 'v32' && isObject(pathItem.additionalOperations)) ops.push(...Object.values(pathItem.additionalOperations));
    ops.filter(isObject).forEach((op) => {
      operations.push({ op, pathKey });
      if (version === 'v2' || !isObject(op.callbacks)) return;
      Object.values(op.callbacks).filter(isObject).forEach((callback) => {
        Object.keys(callback)
          .filter((expression) => !expression.startsWith('x-'))
          .forEach((expression) => visitPathItem(callback[expression], pathKey, chain));
      });
    });
  };
  if (isObject(root.paths)) {
    Object.keys(root.paths)
      .filter((pathKey) => pathKey.startsWith('/'))
      .forEach((pathKey) => visitPathItem(root.paths[pathKey], pathKey, new Set()));
  }
  if ((version === 'v31' || version === 'v32') && isObject(root.webhooks)) {
    Object.values(root.webhooks).forEach((pathItem) => visitPathItem(pathItem, null, new Set()));
  }
  return operations;
};

const definitionsBase = (version) => (version === 'v2' ? ['securityDefinitions'] : ['components', 'securitySchemes']);

const lookup = (root, segments) => segments.reduce((value, segment) => (isObject(value) ? value[segment] : undefined), root);

/**
 * @param {object} root - The resolved document (given: "$")
 * @param {object} options
 * @param {string|string[]} options['allowed-flows'] - OAuth2 flows allowed in oauth2 security schemes, array or comma-separated,
 *   case-insensitive; the Swagger 2.0 names are equivalent to the OpenAPI 3 ones (accessCode = authorizationCode,
 *   application = clientCredentials); blank or unusable falls back to "authorizationCode,clientCredentials"
 * @param {string|string[]} options.paths - comma-separated path patterns matched segment by segment; "*" matches one segment
 *   and "**" zero or more (default "/me,/health,/ping,/status")
 * @param {string} options.pathValidationStrategy - "/exclude" (default) skips the security schemes applied only to matching
 *   paths, "/include" only evaluates the security schemes applied to them; webhooks have no path, so they are only evaluated
 *   with "/exclude", and callbacks follow the path of their operation
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string>}>} one result per disallowed flow, on the scheme definition
 */
module.exports = (root, options, context) => {
  if (!isObject(root)) return [];
  const version = documentVersion(root);
  if (version === null) return [];

  const opts = options || {};
  const allowed = allowedFlows(opts['allowed-flows']);
  const allowedText = [...allowed.values()].join(', ');
  const include = isIncludeStrategy(opts.pathValidationStrategy);
  const patterns = pathPatterns(opts.paths);
  const isEvaluatedPath = (pathKey) => {
    const segments = pathKey.split('/');
    const isListed = patterns.some((pattern) => matchesPattern(pattern, segments));
    return include ? isListed : !isListed;
  };

  const base = definitionsBase(version);
  const definitions = lookup(root, base);
  const rawDefinitions = lookup(context.document && context.document.data, base);
  const schemes = new Map();
  if (isObject(definitions)) {
    Object.keys(definitions).forEach((name) => {
      const scheme = definitions[name];
      if (!isObject(scheme)) return;
      const rawEntry = isObject(rawDefinitions) ? rawDefinitions[name] : undefined;
      const direct = isObject(rawEntry) && !has(rawEntry, '$ref');
      const known = schemes.get(scheme);
      if (!known || (!known.direct && direct)) schemes.set(scheme, { name, path: [...base, name], direct });
    });
  }

  const schemeFor = (key) => {
    if (isObject(definitions) && has(definitions, key)) return isObject(definitions[key]) ? definitions[key] : undefined;
    if (version !== 'v32') return undefined;
    const self = typeof root.$self === 'string' ? root.$self.trim() : '';
    const fragment = self !== '' && key.startsWith(`${self}#`) ? key.slice(self.length) : key;
    if (!fragment.startsWith('#')) return undefined;
    const target = pointerTarget(root, fragment);
    if (!target) return undefined;
    if (!schemes.has(target.value)) {
      schemes.set(target.value, { name: target.segments[target.segments.length - 1], path: target.segments, direct: true });
    }
    return target.value;
  };

  const usage = new Map();
  const rootSecurity = Array.isArray(root.security) ? root.security : [];
  collectOperations(root, version).forEach(({ op, pathKey }) => {
    const security = Array.isArray(op.security) ? op.security : rootSecurity;
    const inScope = pathKey === null ? !include : isEvaluatedPath(pathKey);
    security.filter(isObject).forEach((requirement) => {
      Object.keys(requirement).forEach((key) => {
        const scheme = schemeFor(key);
        if (scheme) usage.set(scheme, usage.get(scheme) === true || inScope);
      });
    });
  });

  const inventory = context.documentInventory;
  const isLocatable = (path) => {
    const item = inventory.findAssociatedItemForPath(path, true);
    if (!item || !item.document) return true;
    return item.document.getRangeForJsonPath(item.path, false) !== undefined;
  };
  const locatable = (path) => {
    if (!inventory || typeof inventory.findAssociatedItemForPath !== 'function') return path;
    for (let length = path.length; length > 0; length -= 1) {
      if (isLocatable(path.slice(0, length))) return path.slice(0, length);
    }
    return path;
  };

  const ruleCode = context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR118';
  const results = [];
  const report = (flow, name, path) => {
    results.push({
      message: `${ruleCode}: Flow '${flow}' of security scheme '${name}' is not allowed. Allowed flows: ${allowedText}.`,
      path: locatable(path),
    });
  };

  schemes.forEach((entry, scheme) => {
    if (usage.has(scheme) ? !usage.get(scheme) : include) return;
    if (typeof scheme.type !== 'string' || scheme.type.trim().toLowerCase() !== 'oauth2') return;
    if (version === 'v2') {
      if (typeof scheme.flow === 'string' && scheme.flow.trim() !== '' && !allowed.has(flowKey(scheme.flow))) {
        report(scheme.flow, entry.name, [...entry.path, 'flow']);
      }
      return;
    }
    if (!isObject(scheme.flows)) return;
    Object.keys(scheme.flows)
      .filter((flow) => !flow.startsWith('x-') && flow.trim() !== '' && !allowed.has(flowKey(flow)))
      .forEach((flow) => report(flow, entry.name, [...entry.path, 'flows', flow]));
  });

  return results;
};
