const { linterForRule } = require('../../helpers/utils');

let linter;

const oar005fail = require('./OAR005/fail-example');
const oar005ok = require('./OAR005/ok-example');
const oar005okNoTrace = require('./OAR005/ok-no-trace');
const oar005failScopesAsMap = require('./OAR005/fail-scopes-as-map');
const oar005okScopesAsMap = require('./OAR005/ok-scopes-as-map');
const oar005failRefSecurity = require('./OAR005/fail-ref-security');

const MESSAGE = 'OAR005: WSO2 scope definition does not exists';

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR005');
  return linter;
});

test('apiq:OAR005 should find errors', () => {
  return linter.run(oar005fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].message).toBe(MESSAGE);
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR005 should find no errors', () => {
  return linter.run(oar005ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR005 does not check trace on Swagger 2.0 (verb does not exist in v2)', () => {
  return linter.run(oar005okNoTrace).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR005 accepts x-wso2-scopes written as a mapping and matches against the map key when it flags', () => {
  return linter.run(oar005failScopesAsMap).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR005 accepts x-wso2-scopes written as a mapping matched by name', () => {
  return linter.run(oar005okScopesAsMap).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR005 resolves a $ref on x-wso2-security', () => {
  return linter.run(oar005failRefSecurity).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});
