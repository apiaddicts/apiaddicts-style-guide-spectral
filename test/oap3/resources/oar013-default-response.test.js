const { linterForRule } = require('../../helpers/utils');

let linter;

const oar013fail = require('./OAR013/fail-example');
const oar013ok = require('./OAR013/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR013');
  return linter;
});

test('apiq:OAR013 should find errors', () => {
  return linter.run(oar013fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR013 should find no errors', () => {
  return linter.run(oar013ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
