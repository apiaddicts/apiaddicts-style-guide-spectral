const { linterForRule } = require('../../helpers/utils');

let linter;

const oar005fail = require('./OAR005/fail-example');
const oar005ok = require('./OAR005/ok-example');
const oar005failKeyNotName = require('./OAR005/fail-key-not-name');
const oar005okScopeKeyNotName = require('./OAR005/ok-scope-key-not-name');
const oar005failNullScope = require('./OAR005/fail-null-scope');
const oar005okNoXScope = require('./OAR005/ok-no-x-scope');
const oar005okPathItemLevelScope = require('./OAR005/ok-path-item-level-scope');
const oar005failRefSecurity = require('./OAR005/fail-ref-security');
const oar005okChainedRefSecurity = require('./OAR005/ok-chained-ref-security');
const oar005failScopesAsMap = require('./OAR005/fail-scopes-as-map');
const oar005okScopesAsMap = require('./OAR005/ok-scopes-as-map');
const oar005failNoSecurity = require('./OAR005/fail-no-security');

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

test('apiq:OAR005 matches only the scope name, never the key', () => {
  return linter.run(oar005failKeyNotName).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR005 accepts an x-scope matching the declared name even when it differs from the key', () => {
  return linter.run(oar005okScopeKeyNotName).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR005 flags an explicit null x-scope', () => {
  return linter.run(oar005failNullScope).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR005 does not flag an operation with no x-scope at all', () => {
  return linter.run(oar005okNoXScope).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR005 ignores an x-scope written at the path-item level', () => {
  return linter.run(oar005okPathItemLevelScope).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR005 resolves a $ref on x-wso2-security', () => {
  return linter.run(oar005failRefSecurity).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR005 resolves a chained $ref on x-wso2-security', () => {
  return linter.run(oar005okChainedRefSecurity).then((results) => {
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

test('apiq:OAR005 flags every x-scope when x-wso2-security is entirely absent', () => {
  return linter.run(oar005failNoSecurity).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR005 declares no functionOptions (zero rule properties, matching Sonar)', async () => {
  const withOptions = await linterForRule('apiq:OAR005', { functionOptions: { 'valid-scopes': 'read,write' } });
  const plain = await linter.run(oar005fail);
  const injected = await withOptions.run(oar005fail);
  expect(injected.map((r) => r.message)).toEqual(plain.map((r) => r.message));
});
