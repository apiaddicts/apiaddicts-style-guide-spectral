const { linterForRule } = require('../../helpers/utils');

let linter;

const oar038fail = require('./OAR038/fail-example');
const oar038ok   = require('./OAR038/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR038');
  return linter;
});

test('apiq:OAR038 should find errors', () => {
  return linter.run(oar038fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR038 should find no errors', () => {
  return linter.run(oar038ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
