const { linterForRule } = require('../../helpers/utils');

let linter;

const oar081failStringNoFormat = require('./OAR081/fail-string-no-format');
const oar081okStringFormat = require('./OAR081/ok-string-format');
const oar081skipNonString = require('./OAR081/skip-non-string-type');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR081');
  return linter;
});

test('apiq:OAR081 should flag a string password field without format: password', () => {
  return linter.run(oar081failStringNoFormat).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toContain('password');
  });
});

test('apiq:OAR081 should pass when a string password field declares format: password', () => {
  return linter.run(oar081okStringFormat).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR081 should not flag a non-string password field (type: integer)', () => {
  return linter.run(oar081skipNonString).then((results) => {
    expect(results.length).toBe(0);
  });
});
