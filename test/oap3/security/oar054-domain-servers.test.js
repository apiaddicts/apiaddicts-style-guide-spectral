const { linterForRule } = require('../../helpers/utils');

let linter;

const oar054fail = require('./OAR054/fail-servers');
const oar054ok = require('./OAR054/ok-servers');

beforeAll(async () => {
  linter = await linterForRule('openapi-custom:OAR054');
  return linter;
});

test('openapi-custom:OAR054 should find errors', () => {
  return linter.run(oar054fail).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].message).toBe('OAR054: Hostname must be a subdomain of the organization\'s domain name.');
    expect(results[0].severity).toBe(0);
  });
});

test('openapi-custom:OAR054 should find no errors', () => {
  return linter.run(oar054ok).then((results) => {
    expect(results.length).toBe(0);
  });
});