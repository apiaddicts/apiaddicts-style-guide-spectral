
const isVariable = (part) => {
  return (part.startsWith('{') && part.endsWith('}'));
}

module.exports = (given, { except }, context) => {
  const result = [];
  const paths = given || [];
  if (paths.length === 0) return result;

  const parts = paths.substr(1).split('/').filter(p => p.length > 0);
  if (parts.length === 0) return result;
  const firstPart = parts.shift();
  let previousIsVar;
  if (except && except.includes(firstPart)) {
    previousIsVar = true;
  } else if (isVariable(firstPart)) {
    return [{ message: context.rule.message }];
  } else {
    previousIsVar = false;
  }

  for (const part of parts) {
    if (except && except.includes(part)) {
      previousIsVar = true;
      continue;
    }

    const currentIsVariable = isVariable(part);
    if (currentIsVariable === previousIsVar) {
      return [{
        message: context.rule.message,
      }];
    }
    previousIsVar = currentIsVariable;
  }

  return result;
};
