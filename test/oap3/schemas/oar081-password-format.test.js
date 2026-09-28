const { linterForRule } = require('../../helpers/utils');

let linter;

const oar081failStringNoFormat = require('./OAR081/fail-string-no-format');
const oar081okStringFormat = require('./OAR081/ok-string-format');
const oar081skipNonString = require('./OAR081/skip-non-string-type');
const oar081failNullableArray = require('./OAR081/fail-nullable-array-password');
const oar081okNullableArrayWithFormat = require('./OAR081/ok-nullable-array-password-with-format');
const oar081okNullableArrayNonString = require('./OAR081/ok-nullable-array-non-string');
const oar081failLargeMultiSchema = require('./OAR081/fail-large-multi-schema');

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

test('apiq:OAR081 should flag a nullable array-typed password field without format: password', () => {
  return linter.run(oar081failNullableArray).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toContain('password');
  });
});

test('apiq:OAR081 should pass when a nullable array-typed password field declares format: password', () => {
  return linter.run(oar081okNullableArrayWithFormat).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR081 should not flag a nullable array-typed non-string password field (type: [integer, null])', () => {
  return linter.run(oar081okNullableArrayNonString).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR081 should hand-count exactly 4 findings across a realistic multi-schema document', () => {
  return linter.run(oar081failLargeMultiSchema).then((results) => {
    expect(results.length).toBe(4);
    const flaggedProps = results.map((r) => r.path[r.path.length - 1]).sort();
    expect(flaggedProps).toEqual([
      'fecha_renovacion_password',
      'oldPassword',
      'password',
      'password_hint',
    ]);
  });
});
