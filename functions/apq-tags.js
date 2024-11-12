
module.exports = (given, _opts, context) => {
  const result = [];
  const tags = given || [];
  if (tags.length === 0) return [{ message: 'Associate at least one tag to this operation.' }];

  for (const tag of tags) {
    if (context.documentInventory.resolved.tags.find(item => item.name === tag) === undefined) {
      result.push({
        message: `Operation references undeclared global tags: ${tag}.`,
      });
    }
  }

  return result;
};
