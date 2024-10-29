
module.exports = (given, { max }) => {
  const result = [];
  if (given === null) return result;

  const parts = given.substr(1).split('/');
  if (parts.length === max) {
    result.push({
      message: `The number of parts of the ${given} must be less than 5`,
    });
  }

  return result;
};
