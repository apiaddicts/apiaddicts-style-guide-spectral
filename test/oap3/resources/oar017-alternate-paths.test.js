const { linterForRule } = require('../../helpers/utils');

let linter;

const oar017fail = require('./OAR017/fail-alternate-paths');
const oar017ok   = require('./OAR017/ok-alternate-paths');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR017');
  return linter;
});

test('apiq:OAR017 should find errors', () => {
  return linter.run(oar017fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR017 should find no errors', () => {
  return linter.run(oar017ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
