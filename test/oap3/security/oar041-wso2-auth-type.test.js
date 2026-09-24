const { linterForRule } = require('../../helpers/utils');

let linter;

const oar041fail = require('./OAR041/fail-example');
const oar041ok = require('./OAR041/ok-example');
const oar041okNoScope = require('./OAR041/ok-no-scope');
const oar041failMultiVerb = require('./OAR041/fail-multi-verb');
const oar041failWebhooks31 = require('./OAR041/fail-webhooks-31');
const oar041okWebhooks31 = require('./OAR041/ok-webhooks-31');
const oar041failPathItems31 = require('./OAR041/fail-path-items-31');
const oar041okPathItems31 = require('./OAR041/ok-path-items-31');
const oar041failAdditionalOperations32 = require('./OAR041/fail-additional-operations-32');
const oar041okAdditionalOperations32 = require('./OAR041/ok-additional-operations-32');

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

test('apiq:OAR041 checks every HTTP verb, not just GET', () => {
  return linter.run(oar041failMultiVerb).then((results) => {
    expect(results.length).toBe(2);
    results.forEach((r) => expect(r.message).toBe(MESSAGE));
  });
});

test('apiq:OAR041 (3.1) flags a webhook operation with x-scope but no x-auth-type', () => {
  return linter.run(oar041failWebhooks31).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR041 (3.1) accepts a compliant webhook operation', () => {
  return linter.run(oar041okWebhooks31).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR041 (3.1) flags an operation under components.pathItems', () => {
  return linter.run(oar041failPathItems31).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(MESSAGE);
  });
});

test('apiq:OAR041 (3.1) accepts a compliant operation under components.pathItems', () => {
  return linter.run(oar041okPathItems31).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR041 (3.2) flags the query verb and additionalOperations', () => {
  return linter.run(oar041failAdditionalOperations32).then((results) => {
    expect(results.length).toBe(2);
    results.forEach((r) => expect(r.message).toBe(MESSAGE));
  });
});

test('apiq:OAR041 (3.2) accepts a compliant query verb and additionalOperations', () => {
  return linter.run(oar041okAdditionalOperations32).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR041 declares no functionOptions (zero rule properties, matching Sonar)', async () => {
  const withOptions = await linterForRule('apiq:OAR041', { functionOptions: { 'auth-type': 'Application' } });
  const plain = await linter.run(oar041fail);
  const injected = await withOptions.run(oar041fail);
  expect(injected.map((r) => r.message)).toEqual(plain.map((r) => r.message));
});
