const pathPatterns = (raw, defaultPaths) => {
  let items = [];
  if (raw === undefined) items = defaultPaths.split(',');
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

const pathsIncludeExclude = (options, defaultPaths) => {
  const opts = options || {};
  const include = isIncludeStrategy(opts.pathValidationStrategy);
  const patterns = pathPatterns(opts.paths, defaultPaths);
  const isEvaluatedPath = (pathKey) => {
    const segments = pathKey.split('/');
    const isListed = patterns.some((pattern) => matchesPattern(pattern, segments));
    return include ? isListed : !isListed;
  };
  return { include, isEvaluatedPath };
};

module.exports = { pathsIncludeExclude };
