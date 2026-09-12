const MESSAGE = 'WSO2 x-scope requires x-auth-type definition';

const VERBS_V2 = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];
const VERBS_V3 = VERBS_V2.concat(['trace']);
const VERBS_V32 = VERBS_V3.concat(['query']);

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

function issuePrefix(context) {
  const name = (context && context.rule && context.rule.name) || '';
  const code = name.indexOf(':') === -1 ? name : name.split(':').pop();
  return code ? `${code}: ` : '';
}

/**
 * @param {object} given the whole raw document, since the rule is anchored with `given: "$"`
 * @param {null} _options OAR041 has no rule properties on either engine
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 * @returns {Array<{message: string, path: Array<string|number>}>}
 */
module.exports = (given, _options, context) => {
  if (!isPlainObject(given)) return [];

  const version = documentVersion(given);
  const surface = surfaceFor(version);
  const prefix = issuePrefix(context);
  const results = [];

  collectOperations(given, surface).forEach(({ op, path }) => {
    if (!Object.prototype.hasOwnProperty.call(op, 'x-scope')) return;
    if (Object.prototype.hasOwnProperty.call(op, 'x-auth-type')) return;

    results.push({ message: `${prefix}${MESSAGE}`, path: path.concat(['x-scope']) });
  });

  return results;
};
