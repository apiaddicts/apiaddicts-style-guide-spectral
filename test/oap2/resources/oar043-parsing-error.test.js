const { linterForRule } = require('../../helpers/utils');

let linter;

const oar043fail = require('./OAR043/fail-example');
const oar043ok = require('./OAR043/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR043');
  return linter;
});

test('apiq:OAR043 should find errors', () => {
  return linter.run(oar043fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR043 should find no errors', () => {
  return linter.run(oar043ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
