const { linterForRule } = require('../../helpers/utils');

let linter;

const oar015fail = require('./OAR015/fail-example');
const oar015ok = require('./OAR015/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR015');
  return linter;
});

test('apiq:OAR015 should find errors', () => {
  return linter.run(oar015fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR015 should find no errors', () => {
  return linter.run(oar015ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
