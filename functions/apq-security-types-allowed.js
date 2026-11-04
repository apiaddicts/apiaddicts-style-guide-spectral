const { pathsIncludeExclude } = require('./paths-include-exclude.js');

const DEFAULT_ALLOWED_TYPES = 'oauth2,bearer';
const DEFAULT_PATHS = '/me,/health,/ping,/status';

const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const typeKey = (name) => name.trim().toLowerCase();

const documentVersion = (root) => {
  if (has(root, 'swagger')) return 'v2';
  if (!has(root, 'openapi')) return null;
  const openapi = String(root.openapi).trim();
  if (openapi.startsWith('3.2')) return 'v32';
  if (openapi.startsWith('3.1')) return 'v31';
  return 'v3';
};

const allowedTypes = (raw) => {
  let items = [];
  if (typeof raw === 'string') items = raw.split(',');
  else if (Array.isArray(raw)) items = raw.filter((item) => typeof item === 'string').flatMap((item) => item.split(','));
  const names = new Map();
  items.map((item) => item.trim()).filter(Boolean).forEach((item) => {
    if (!names.has(typeKey(item))) names.set(typeKey(item), item);
  });
  return names.size > 0 ? names : allowedTypes(DEFAULT_ALLOWED_TYPES);
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
 * @param {string|string[]} options['allowed-security-types'] - security scheme types allowed, array or comma-separated,
 *   case-insensitive: apiKey, http, oauth2, openIdConnect, mutualTLS, or an HTTP authentication scheme (basic, bearer,
 *   digest...) that allows only that scheme of the http type; "http" allows every HTTP scheme and Swagger 2.0 "basic" is
 *   the HTTP basic scheme; blank or unusable falls back to "oauth2,bearer"
 * @param {string|string[]} options.paths - comma-separated path patterns matched segment by segment; "*" matches one segment
 *   and "**" zero or more (default "/me,/health,/ping,/status")
 * @param {string} options.pathValidationStrategy - "/exclude" (default) skips the security schemes applied only to matching
 *   paths, "/include" only evaluates the security schemes applied to them; webhooks have no path, so they are only evaluated
 *   with "/exclude", and callbacks follow the path of their operation
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string>}>} one result per scheme whose type is not allowed
 */
module.exports = (root, options, context) => {
  if (!isObject(root)) return [];
  const version = documentVersion(root);
  if (version === null) return [];

  const opts = options || {};
  const allowed = allowedTypes(opts['allowed-security-types']);
  const allowedText = [...allowed.values()].join(', ');
  const { include, isEvaluatedPath } = pathsIncludeExclude(opts, DEFAULT_PATHS);

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

  const ruleCode = context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR121';
  const results = [];

  schemes.forEach((entry, scheme) => {
    if (usage.has(scheme) ? !usage.get(scheme) : include) return;
    if (typeof scheme.type !== 'string' || scheme.type.trim() === '') return;
    const type = scheme.type.trim();
    const httpScheme = version !== 'v2' && typeKey(type) === 'http' && typeof scheme.scheme === 'string' && scheme.scheme.trim() !== ''
      ? scheme.scheme.trim()
      : null;
    const labels = [typeKey(type)];
    if (httpScheme !== null) labels.push(typeKey(httpScheme));
    if (version === 'v2' && typeKey(type) === 'basic') labels.push('http');
    if (labels.some((label) => allowed.has(label))) return;
    const described = httpScheme === null ? `type '${type}'` : `type '${type}' with scheme '${httpScheme}'`;
    results.push({
      message: `${ruleCode}: Security scheme '${entry.name}' ${described} is not allowed. Allowed types: ${allowedText}.`,
      path: locatable([...entry.path, httpScheme === null ? 'type' : 'scheme']),
    });
  });

  return results;
};
