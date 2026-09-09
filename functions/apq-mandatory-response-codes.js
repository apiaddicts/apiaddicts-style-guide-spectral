module.exports = (operation, options, context) => {
  if (!operation || typeof operation !== 'object') return [];

  const mandatoryCodes = ((options && options['mandatory-response-codes']) || '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean);
  if (mandatoryCodes.length === 0) return [];

  const paths = ((options && options.paths) || '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean);
  const strategy = (options && options.pathValidationStrategy) || '/exclude';

  const currentPath = context.path[context.path.length - 2];
  const isListed = paths.includes(currentPath);
  const shouldExclude = strategy === '/exclude' ? isListed : !isListed;
  if (shouldExclude) return [];

  const message = `Mandatory response code(s) required: ${mandatoryCodes.join(', ')}.`;

  const responses = operation.responses;
  if (!responses || typeof responses !== 'object') {
    return [{ message }];
  }

  const responseCodes = Object.keys(responses).map((code) => code.trim());
  const hasMandatoryCode = mandatoryCodes.some((code) => responseCodes.includes(code));

  if (!hasMandatoryCode) {
    return [{ message }];
  }

  return [];
};
