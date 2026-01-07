const { linterForRule } = require('../../helpers/utils');

let linter;

const oar078fail = require('./OAR078/fail-example');
const oar078ok = require('./OAR078/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR078');
  return linter;
});

test('apiq:OAR078 should find errors', () => {
  return linter.run(oar078fail).then((results) => {
    expect(results.length).toBe(5);
  });
});

test('apiq:OAR078 should find no errors', () => {
  return linter.run(oar078ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
