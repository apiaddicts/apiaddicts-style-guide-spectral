module.exports = (operation, options, context) => {
  if (!operation || typeof operation !== 'object' || Array.isArray(operation)) return [];

  const paths = ((options && options.paths) || '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean);
  const strategy = (options && options.pathValidationStrategy) || '/exclude';

  const currentPath = context.path[context.path.length - 2];
  const isListed = paths.includes(currentPath);
  const shouldExclude = strategy === '/exclude' ? isListed : !isListed;
  if (shouldExclude) return [];

  const responses = operation.responses;
  if (!responses || typeof responses !== 'object' || !('429' in responses)) {
    return [{ message: context.rule.message }];
  }

  return [];
};
