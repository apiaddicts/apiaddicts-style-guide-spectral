const { schema } = require('@stoplight/spectral-functions');

module.exports = (given, { except, schema }, context) => {
  const result = [];
  const paths = given || [];
  if (paths.length === 0) return result;

  console.log(context.rule.path);

  return result;
};
