const { linterForRule } = require('../../helpers/utils');

let linter;

const oar066fail = require('./OAR066/fail-example');
const oar066ok   = require('./OAR066/ok-example');
const oar066failNested = require('./OAR066/fail-nested-properties');
const oar066failRef = require('./OAR066/fail-ref-schema');
const oar066okAllowedPrefixes = require('./OAR066/ok-allowed-prefixes');
const oar066failLarge = require('./OAR066/fail-large-multi-schema');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR066');
  return linter;
});

test('apiq:OAR066 should find errors', () => {
  return linter.run(oar066fail).then((results) => {
    expect(results.length).toBe(11);
  });
});

test('apiq:OAR066 should find no errors', () => {
  return linter.run(oar066ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR066 flags a 2+-level-deep nested camelCase property (confirms ..properties deep recursion)', () => {
  return linter.run(oar066failNested).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR066 flags a bad property name reached through a $ref', () => {
  return linter.run(oar066failRef).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path).toEqual([
      'paths', '/widgets', 'post', 'requestBody', 'content', 'application/json', 'schema', 'properties', 'widgetName',
    ]);
  });
});

test('apiq:OAR066 does not flag the allowed exempt prefixes (_leading, @Custom, x-custom-ext)', () => {
  return linter.run(oar066okAllowedPrefixes).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR066 large multi-schema fixture: hand-counted 6 violations across 5 schemas', () => {
  return linter.run(oar066failLarge).then((results) => {
    expect(results.length).toBe(6);
  });
});
