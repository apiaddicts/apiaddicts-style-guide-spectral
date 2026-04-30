const { linterForRule } = require('../../helpers/utils');

let linter;

const oar061fail = require('./OAR061/fail-example');
const oar061ok = require('./OAR061/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR061');
  return linter;
});

test('apiq:OAR061 should find errors', () => {
  return linter.run(oar061fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR061 should find no errors', () => {
  return linter.run(oar061ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
