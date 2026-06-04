const { linterForRule } = require('../../helpers/utils');

let linter;

const oar032fail = require('./OAR032/fail-example');
const oar032ok = require('./OAR032/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR032');
  return linter;
});

test('apiq:OAR032 should find errors', () => {
  return linter.run(oar032fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR032 should find no errors', () => {
  return linter.run(oar032ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
