const { linterForRule } = require('../../helpers/utils');

let linter;

const oar001fail = require('./OAR001/fail-https');
const oar001ok = require('./OAR001/ok-https');

beforeAll(async () => {
  linter = await linterForRule('openapi-custom:OAR001');
  return linter;
});

test('openapi-custom:OAR001 should find errors', () => {
  return linter.run(oar001fail).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR001: HTTPS protocol is mandatory.');
    expect(results[0].severity).toBe(0);
  });
});

test('openapi-custom:OAR001 should find no errors', () => {
  return linter.run(oar001ok).then((results) => {
    expect(results.length).toBe(0);
  });
});