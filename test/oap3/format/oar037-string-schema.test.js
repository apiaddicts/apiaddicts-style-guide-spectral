const { linterForRule } = require('../../helpers/utils');

let linter;

const oar037fail = require('./OAR037/fail-string-format');
const oar037ok = require('./OAR037/ok-string-format');
const oar037arrayType31 = require('./OAR037/fail-array-type-31');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR037');
  return linter;
});

test('apiq:OAR037 should find errors', () => {
  return linter.run(oar037fail).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('apiq:OAR037 should find no errors', () => {
  return linter.run(oar037ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR037 should apply to 3.1 array-form string type', () => {
  return linter.run(oar037arrayType31).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toContain('id');
  });
});