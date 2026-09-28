const { linterForRule } = require('../../helpers/utils');

let linter;

const oar065fail = require('./OAR065/fail-example');
const oar065ok = require('./OAR065/ok-example');
const oar065failNoMandatoryCode = require('./OAR065/fail-no-mandatory-code');
const oar065okSingleMandatoryCode = require('./OAR065/ok-single-mandatory-code');
const oar065okTwoMandatoryCodesPresent = require('./OAR065/ok-two-mandatory-codes-present');
const oar065okAllMandatoryCodesPresent = require('./OAR065/ok-all-mandatory-codes-present');
const oar065failLargeMultiOperation = require('./OAR065/fail-large-multi-operation');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR065');
  return linter;
});

test('apiq:OAR065 should find errors', () => {
  return linter.run(oar065fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR065 should find no errors', () => {
  return linter.run(oar065ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR065 should flag an operation with only non-mandatory response codes', () => {
  return linter.run(oar065failNoMandatoryCode).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR065 should pass with exactly one mandatory response code present', () => {
  return linter.run(oar065okSingleMandatoryCode).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR065 should pass with two mandatory response codes present simultaneously (oneOf regression)', () => {
  return linter.run(oar065okTwoMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR065 should pass with every mandatory response code present at once', () => {
  return linter.run(oar065okAllMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR065 should flag only the non-compliant operations and exclude /status', () => {
  return linter.run(oar065failLargeMultiOperation).then((results) => {
    expect(results.length).toBe(3);
    expect(results.some((result) => result.path.includes('/status'))).toBe(false);
  });
});
