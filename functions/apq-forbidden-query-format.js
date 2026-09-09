module.exports = (parameter, options, context) => {
  if (!parameter || typeof parameter !== 'object') return [];

  const forbiddenFormats = ((options && options['forbidden-query-formats']) || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (forbiddenFormats.length === 0) return [];

  const paths = ((options && options.paths) || '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean);
  const strategy = (options && options.pathValidationStrategy) || '/include';

  const currentPath = context.path[1];
  const isListed = paths.includes(currentPath);
  const shouldExclude = strategy === '/exclude' ? isListed : !isListed;
  if (shouldExclude) return [];

  const root = context.document.parserResult.data;
  const format = root.swagger ? parameter.format : parameter.schema && parameter.schema.format;

  if (typeof format === 'string' && forbiddenFormats.includes(format)) {
    return [{ message: context.rule.message }];
  }

  return [];
};
