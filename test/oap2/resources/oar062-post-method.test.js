const { linterForRule } = require('../../helpers/utils');

let linter;

const oar062fail = require('./OAR062/fail-example');
const oar062ok = require('./OAR062/ok-example');
const oar062failNoMandatoryCode = require('./OAR062/fail-no-mandatory-code');
const oar062okSingleMandatoryCode = require('./OAR062/ok-single-mandatory-code');
const oar062okTwoMandatoryCodesPresent = require('./OAR062/ok-two-mandatory-codes-present');
const oar062okAllMandatoryCodesPresent = require('./OAR062/ok-all-mandatory-codes-present');
const oar062failLargeMultiOperation = require('./OAR062/fail-large-multi-operation');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR062');
  return linter;
});

test('apiq:OAR062 should find errors', () => {
  return linter.run(oar062fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR062 should find no errors', () => {
  return linter.run(oar062ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR062 should flag an operation with only non-mandatory response codes', () => {
  return linter.run(oar062failNoMandatoryCode).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR062 should pass with exactly one mandatory response code present', () => {
  return linter.run(oar062okSingleMandatoryCode).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR062 should pass with two mandatory response codes present simultaneously (oneOf regression)', () => {
  return linter.run(oar062okTwoMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR062 should pass with every mandatory response code present at once', () => {
  return linter.run(oar062okAllMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR062 should flag only the non-compliant operations and exclude /status', () => {
  return linter.run(oar062failLargeMultiOperation).then((results) => {
    expect(results.length).toBe(3);
    expect(results.some((result) => result.path.includes('/status'))).toBe(false);
  });
});
