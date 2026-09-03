const { linterForRule } = require('../../helpers/utils');

let linter;

const oar016fail = require('./OAR016/fail-example');
const oar016ok = require('./OAR016/ok-example');
const oar016failArray = require('./OAR016/fail-array-type-31');
const oar016okArray = require('./OAR016/ok-array-type-31');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR016');
  return linter;
});

test('apiq:OAR016 should find errors', () => {
  return linter.run(oar016fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR016 should find no errors', () => {
  return linter.run(oar016ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR016 should find errors with an array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar016failArray).then((results) => {
    expect(results.length).toBe(6);
  });
});

test('apiq:OAR016 should find no errors with a compliant array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar016okArray).then((results) => {
    expect(results.length).toBe(0);
  });
});
