const { linterForRule } = require('../../helpers/utils');

let linter;

const oar062fail = require('./OAR062/fail-example');
const oar062ok = require('./OAR062/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR062');
  return linter;
});

test('apiq:OAR062 should find errors', () => {
  return linter.run(oar062fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR062 should find no errors', () => {
  return linter.run(oar062ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
