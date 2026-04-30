const { linterForRule } = require('../../helpers/utils');

let linter;

const oar065fail = require('./OAR065/fail-example');
const oar065ok = require('./OAR065/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR065');
  return linter;
});

test('apiq:OAR065 should find errors', () => {
  return linter.run(oar065fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR065 should find no errors', () => {
  return linter.run(oar065ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
