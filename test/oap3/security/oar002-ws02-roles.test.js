const { linterForRule } = require('../../helpers/utils');

let linter;

const oar002fail = require('./OAR002/fail-example');
const oar002ok = require('./OAR002/ok-example');
const oar002null = require('./OAR002/fail-null');
const oar002empty = require('./OAR002/fail-empty');
const oar002allCases = require('./OAR002/fail-all-cases');

const DEFINITION_WRONG = "OAR002: WSO2 scopes definition is wrong";
const requiredMessage = (prop) => `OAR002: WSO2 scope '${prop}' is required`;

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR002');
  return linter;
});

test('apiq:OAR002 flags a scope missing its key', () => {
  return linter.run(oar002fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].message).toBe(requiredMessage('key'));
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR002 should find no errors on a well-formed definition', () => {
  return linter.run(oar002ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR002 flags a null scopes container', () => {
  return linter.run(oar002null).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(DEFINITION_WRONG);
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR002 flags an empty scopes container', () => {
  return linter.run(oar002empty).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(DEFINITION_WRONG);
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR002 flags every missing/null name, key and roles', () => {
  return linter.run(oar002allCases).then((results) => {
    expect(results.length).toBe(6);
    const messages = results.map((r) => r.message).sort();
    expect(messages).toEqual([
      requiredMessage('key'),
      requiredMessage('key'),
      requiredMessage('name'),
      requiredMessage('name'),
      requiredMessage('roles'),
      requiredMessage('roles'),
    ]);
    results.forEach((r) => expect(r.severity).toBe(0));
  });
});
