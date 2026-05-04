const { linterForRule } = require('../../helpers/utils');

let linter;

const oar066fail = require('./OAR066/fail-example');
const oar066ok   = require('./OAR066/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR066');
  return linter;
});

test('apiq:OAR066 should find errors', () => {
  return linter.run(oar066fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR066 should find no errors', () => {
  return linter.run(oar066ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
