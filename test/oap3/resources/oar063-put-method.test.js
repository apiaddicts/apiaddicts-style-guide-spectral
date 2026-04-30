const { linterForRule } = require('../../helpers/utils');

let linter;

const oar063fail = require('./OAR063/fail-example');
const oar063ok = require('./OAR063/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR063');
  return linter;
});

test('apiq:OAR063 should find errors', () => {
  return linter.run(oar063fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR063 should find no errors', () => {
  return linter.run(oar063ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
