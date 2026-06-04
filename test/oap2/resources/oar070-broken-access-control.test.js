const { linterForRule } = require('../../helpers/utils');

let linter;

const oar070fail = require('./OAR070/fail-example');
const oar070ok = require('./OAR070/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR070');
  return linter;
});

test('apiq:OAR070 should find errors', () => {
  return linter.run(oar070fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR070 should find no errors', () => {
  return linter.run(oar070ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
