module.exports = (targetVal, options = {}, context) => {
  const { 'path-exclusions': pathExclusionsOpt = '' } = options;

  const exclusions = new Set(
    String(pathExclusionsOpt)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean),
  );

  const path = context.path?.find((p) => typeof p === 'string' && p.startsWith('/'));
  if (path && exclusions.has(path)) {
    return [];
  }

  if (targetVal === true || targetVal === 'true') {
    return [{ message: 'OAR060: All query parameter must be optional (required: false).' }];
  }

  return [];
};
