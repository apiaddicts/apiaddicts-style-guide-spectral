/**
 * @param {object} given - the whole document ($)
 * @param {object} options - unused
 * @param {import('@stoplight/spectral-core').RulesetFunctionContext} context
 */
module.exports = (given, options, context) => {
  const errors = [];
  const doc = given || {};
  const tags = Array.isArray(doc.tags) ? doc.tags : [];

  if (tags.length === 0) {
    return [{
      message: 'OAR047: Add tags with a short description to each one.',
      path: ['tags'],
    }];
  }

  const declaredNames = new Set();

  tags.forEach((tag, index) => {
    if (!tag || typeof tag !== 'object') return;
    const { name, description } = tag;

    if (typeof name === 'string' && name.length > 0) {
      if (declaredNames.has(name)) {
        errors.push({
          message: 'OAR047: Remove this duplicate tag',
          path: ['tags', index, 'name'],
        });
      } else {
        declaredNames.add(name);
      }
    } else {
      errors.push({
        message: 'OAR047: Add tags with a short description to each one.',
        path: ['tags', index],
      });
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      errors.push({
        message: 'OAR047: Add a short description to this tag',
        path: ['tags', index, 'description'],
      });
    }
  });

  const verbs = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'];
  const walkOperations = (paths, rootKey) => {
    Object.entries(paths || {}).forEach(([pathKey, pathItem]) => {
      if (!pathItem || typeof pathItem !== 'object') return;
      verbs.forEach((verb) => {
        const operation = pathItem[verb];
        if (!operation || typeof operation !== 'object' || !Array.isArray(operation.tags)) return;
        operation.tags.forEach((tagName, tagIndex) => {
          if (typeof tagName === 'string' && !declaredNames.has(tagName)) {
            errors.push({
              message: 'OAR047: This tag should be declared in the tags section of the contract',
              path: [rootKey, pathKey, verb, 'tags', tagIndex],
            });
          }
        });
      });
    });
  };

  walkOperations(doc.paths, 'paths');
  if (doc.webhooks) walkOperations(doc.webhooks, 'webhooks');

  return errors;
};
