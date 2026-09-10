module.exports = (targetVal, options = {}) => {
  const patternStr = (options && options.pattern) || '^/';

  if (typeof targetVal !== 'string') {
    return [];
  }

  const regex = new RegExp(patternStr);
  if (!regex.test(targetVal)) {
    return [{ message: `OAR116: Path does not match the required pattern: ${patternStr}` }];
  }

  return [];
};
