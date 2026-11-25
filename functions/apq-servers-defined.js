const VERBS_V3 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const VERBS_V32 = VERBS_V3.concat(['query']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const documentVersion = (root) => {
  if (has(root, 'swagger')) return 'v2';
  if (!has(root, 'openapi')) return null;
  return String(root.openapi).trim().startsWith('3.2') ? 'v32' : 'v3';
};

const isHttpUrl = (url) => {
  try {
    return new URL(url).hostname !== '';
  } catch (err) {
    return false;
  }
};

const isAbsoluteServerUrl = (server) => {
  if (typeof server.url !== 'string' || !/^https?:\/\/[^/?#\s]/.test(server.url)) return false;
  const variables = isObject(server.variables) ? server.variables : {};
  const url = server.url.replace(/\{([^{}]*)\}/g, (placeholder, name) => {
    const variable = has(variables, name) ? variables[name] : undefined;
    return isObject(variable) && typeof variable.default === 'string' ? variable.default : placeholder;
  });
  return !/[{}]/.test(url) && isHttpUrl(url);
};

/**
 * @param {object} root - The resolved document (given: "$")
 * @param {object} options - unused, the rule has no parameters
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string|number>}>} the problems that keep the API gateway
 *   from knowing where to route the traffic.
 */
module.exports = (root, options, context) => {
  if (!isObject(root)) return [];
  const version = documentVersion(root);
  if (version === null) return [];

  const ruleCode = context && context.rule && context.rule.name ? context.rule.name.split(':').pop() : 'OAR122';
  const inventory = context && context.documentInventory;
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
  const results = [];
  const report = (message, path) => results.push({ message: `${ruleCode}: ${message}`, path: locatable(path) });

  if (version === 'v2') {
    const { host, schemes, basePath } = root;
    if (typeof host !== 'string' || host.trim() === '') {
      report('The host must be defined.', ['host']);
    } else if (!/^[^\s/?#@{}\\]+$/.test(host) || !isHttpUrl(`http://${host}`)) {
      report('The host must be a host name with an optional port, without scheme or path.', ['host']);
    }
    if (Array.isArray(schemes)) {
      schemes.forEach((scheme, index) => {
        if (scheme !== 'http' && scheme !== 'https') report('Server scheme must be http or https.', ['schemes', index]);
      });
    }
    if (has(root, 'basePath') && (typeof basePath !== 'string' || !basePath.startsWith('/'))) {
      report("The basePath must start with '/'.", ['basePath']);
    }
    return results;
  }

  const checked = new WeakSet();
  const checkServers = (servers, path) => {
    if (!Array.isArray(servers)) return;
    servers.forEach((server, index) => {
      if (isObject(server)) {
        if (checked.has(server)) return;
        checked.add(server);
      }
      const serverPath = path.concat([index]);
      if (!isObject(server)) {
        report('Server URL must be an absolute http or https URL.', serverPath);
        return;
      }
      if (typeof server.$ref === 'string') {
        report('Server URL must be an absolute http or https URL.', path);
        return;
      }
      if (!isAbsoluteServerUrl(server)) {
        report('Server URL must be an absolute http or https URL.', has(server, 'url') ? serverPath.concat(['url']) : serverPath);
      }
      if (isObject(server.variables)) {
        Object.keys(server.variables).forEach((name) => {
          const variable = server.variables[name];
          if (isObject(variable) && typeof variable.default === 'string') return;
          const variablePath = serverPath.concat(['variables', name]);
          report(`Server variable '${name}' must have a string default value.`, isObject(variable) && has(variable, 'default') ? variablePath.concat(['default']) : variablePath);
        });
      }
    });
  };

  if (!Array.isArray(root.servers) || root.servers.length === 0) {
    report('At least one server must be defined in servers.', ['servers']);
  }
  checkServers(root.servers, ['servers']);

  const verbs = version === 'v32' ? VERBS_V32 : VERBS_V3;
  const paths = isObject(root.paths) ? root.paths : {};
  Object.keys(paths).forEach((pathKey) => {
    const pathItem = paths[pathKey];
    if (pathKey.startsWith('x-') || !isObject(pathItem)) return;
    checkServers(pathItem.servers, ['paths', pathKey, 'servers']);
    verbs.forEach((verb) => {
      if (isObject(pathItem[verb])) checkServers(pathItem[verb].servers, ['paths', pathKey, verb, 'servers']);
    });
    if (version === 'v32' && isObject(pathItem.additionalOperations)) {
      Object.keys(pathItem.additionalOperations).forEach((method) => {
        const operation = pathItem.additionalOperations[method];
        if (isObject(operation)) checkServers(operation.servers, ['paths', pathKey, 'additionalOperations', method, 'servers']);
      });
    }
  });

  return results;
};
