const { linterForRule } = require('../../helpers/utils');

let linter;

const oar018fail = require('./OAR018/fail-example');
const oar018ok   = require('./OAR018/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR018');
  return linter;
});

test('apiq:OAR018 should find errors', () => {
  return linter.run(oar018fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR018 should find no errors', () => {
  return linter.run(oar018ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
