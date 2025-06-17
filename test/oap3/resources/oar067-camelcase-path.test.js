const { linterForRule } = require('../../helpers/utils');

let linter;

const oar067fail = require('./OAR067/fail-example');
const oar067ok   = require('./OAR067/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR067');
  return linter;
});

test('apiq:OAR067 should find errors', () => {
  return linter.run(oar067fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR067 should find no errors', () => {
  return linter.run(oar067ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
