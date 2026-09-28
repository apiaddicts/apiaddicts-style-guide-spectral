const { linterForRule } = require('../../helpers/utils');

let linter;

const oar063fail = require('./OAR063/fail-example');
const oar063ok = require('./OAR063/ok-example');
const oar063failNoMandatoryCode = require('./OAR063/fail-no-mandatory-code');
const oar063okSingleMandatoryCode = require('./OAR063/ok-single-mandatory-code');
const oar063okTwoMandatoryCodesPresent = require('./OAR063/ok-two-mandatory-codes-present');
const oar063okAllMandatoryCodesPresent = require('./OAR063/ok-all-mandatory-codes-present');
const oar063failLargeMultiOperation = require('./OAR063/fail-large-multi-operation');

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

test('apiq:OAR063 should flag an operation with only non-mandatory response codes', () => {
  return linter.run(oar063failNoMandatoryCode).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR063 should pass with exactly one mandatory response code present', () => {
  return linter.run(oar063okSingleMandatoryCode).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR063 should pass with two mandatory response codes present simultaneously (oneOf regression)', () => {
  return linter.run(oar063okTwoMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR063 should pass with every mandatory response code present at once', () => {
  return linter.run(oar063okAllMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR063 should flag only the non-compliant operations and exclude /status', () => {
  return linter.run(oar063failLargeMultiOperation).then((results) => {
    expect(results.length).toBe(3);
    expect(results.some((result) => result.path.includes('/status'))).toBe(false);
  });
});
