const { linterForRule } = require('../../helpers/utils');

let linter;

const oar041fail = require('./OAR041/fail-example');
const oar041ok = require('./OAR041/ok-example');
const oar041okNoScope = require('./OAR041/ok-no-scope');
const oar041failScopeEmpty = require('./OAR041/fail-scope-empty');
const oar041failScopeNull = require('./OAR041/fail-scope-null');
const oar041okAuthTypeBlank = require('./OAR041/ok-auth-type-blank');
const oar041failMultiVerb = require('./OAR041/fail-multi-verb');

const MESSAGE = 'OAR041: WSO2 x-scope requires x-auth-type definition';

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR041');
  return linter;
});

test('apiq:OAR041 should find errors', () => {
  return linter.run(oar041fail).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR041 should find no errors', () => {
  return linter.run(oar041ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR041 does not flag an operation with no x-scope at all', () => {
  return linter.run(oar041okNoScope).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR041 flags an empty-string x-scope (key is still present)', () => {
  return linter.run(oar041failScopeEmpty).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR041 flags an explicit null x-scope (key is still present)', () => {
  return linter.run(oar041failScopeNull).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR041 accepts a blank x-auth-type as long as the key is present', () => {
  return linter.run(oar041okAuthTypeBlank).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR041 checks every HTTP verb, not just GET', () => {
  return linter.run(oar041failMultiVerb).then((results) => {
    expect(results.length).toBe(2);
    results.forEach((r) => expect(r.message).toBe(MESSAGE));
  });
});

test('apiq:OAR041 declares no functionOptions (zero rule properties, matching Sonar)', async () => {
  const withOptions = await linterForRule('apiq:OAR041', { functionOptions: { 'auth-type': 'Application' } });
  const plain = await linter.run(oar041fail);
  const injected = await withOptions.run(oar041fail);
  expect(injected.map((r) => r.message)).toEqual(plain.map((r) => r.message));
});
