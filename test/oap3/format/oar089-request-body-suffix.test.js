const { linterForRule } = require('../../helpers/utils');

let linter;

const oar089fail = require('./OAR089/fail-example');
const oar089ok = require('./OAR089/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR089');
  return linter;
});

test('apiq:OAR089 should find errors', () => {
  return linter.run(oar089fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR089 should find no errors', () => {
  return linter.run(oar089ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
