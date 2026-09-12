const { linterForRule } = require('../../helpers/utils');

let linter;

const oar047ok = require('./OAR047/ok-swagger2-tags');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR047');
  return linter;
});

test('apiq:OAR047 well-formed Swagger 2.0 tags should find no errors', () => {
  return linter.run(oar047ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
