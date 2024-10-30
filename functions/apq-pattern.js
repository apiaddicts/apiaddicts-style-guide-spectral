module.exports = (given, { match }, context) => {
  const result = [];
  if (given === null) return result;


  return given.match(match) ? result : [{ message: context.rule.message }];
};