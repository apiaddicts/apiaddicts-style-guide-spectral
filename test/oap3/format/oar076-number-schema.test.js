const { linterForRule } = require('../../helpers/utils');

let linter;

const oar076fail = require('./OAR076/fail-number-format');
const oar076ok = require('./OAR076/ok-number-format');
const oar076failArray = require('./OAR076/fail-array-type-31');
const oar076okArray = require('./OAR076/ok-array-type-31');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR076');
  return linter;
});

test('apiq:OAR076 should find errors', () => {
  return linter.run(oar076fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR076 should find no errors', () => {
  return linter.run(oar076ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR076 should find missing AND invalid formats with an array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar076failArray).then((results) => {
    expect(results.length).toBe(8);
  });
});

test('apiq:OAR076 should find no errors with a compliant array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar076okArray).then((results) => {
    expect(results.length).toBe(0);
  });
});