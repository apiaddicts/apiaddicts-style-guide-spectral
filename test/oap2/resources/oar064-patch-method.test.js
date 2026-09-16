const { linterForRule } = require('../../helpers/utils');

let linter;

const oar064fail = require('./OAR064/fail-example');
const oar064ok = require('./OAR064/ok-example');
const oar064failNoMandatoryCode = require('./OAR064/fail-no-mandatory-code');
const oar064okSingleMandatoryCode = require('./OAR064/ok-single-mandatory-code');
const oar064okTwoMandatoryCodesPresent = require('./OAR064/ok-two-mandatory-codes-present');
const oar064okAllMandatoryCodesPresent = require('./OAR064/ok-all-mandatory-codes-present');
const oar064failLargeMultiOperation = require('./OAR064/fail-large-multi-operation');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR064');
  return linter;
});

test('apiq:OAR064 should find errors', () => {
  return linter.run(oar064fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR064 should find no errors', () => {
  return linter.run(oar064ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR064 should flag an operation with only non-mandatory response codes', () => {
  return linter.run(oar064failNoMandatoryCode).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR064 should pass with exactly one mandatory response code present', () => {
  return linter.run(oar064okSingleMandatoryCode).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR064 should pass with two mandatory response codes present simultaneously (oneOf regression)', () => {
  return linter.run(oar064okTwoMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR064 should pass with every mandatory response code present at once', () => {
  return linter.run(oar064okAllMandatoryCodesPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR064 should flag only the non-compliant operations and exclude /status', () => {
  return linter.run(oar064failLargeMultiOperation).then((results) => {
    expect(results.length).toBe(3);
    expect(results.some((result) => result.path.includes('/status'))).toBe(false);
  });
});
