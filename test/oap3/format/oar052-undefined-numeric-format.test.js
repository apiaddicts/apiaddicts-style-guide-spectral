const { linterForRule } = require('../../helpers/utils');

let linter;

const oar052fail = require('./OAR052/fail-example');
const oar052ok = require('./OAR052/ok-example');
const oar052failArray = require('./OAR052/fail-array-type-31');
const oar052okArray = require('./OAR052/ok-array-type-31');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR052');
  return linter;
});

test('apiq:OAR052 should find errors', () => {
  return linter.run(oar052fail).then((results) => {
    expect(results.length).toBe(9);
  });
});

test('apiq:OAR052 should find no errors', () => {
  return linter.run(oar052ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR052 should find errors with an array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar052failArray).then((results) => {
    expect(results.length).toBe(6);
  });
});

test('apiq:OAR052 should find no errors with a compliant array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar052okArray).then((results) => {
    expect(results.length).toBe(0);
  });
});