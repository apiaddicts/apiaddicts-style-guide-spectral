const { linterForRule } = require('../../helpers/utils');

let linter;

const oar029fail = require('./OAR029/fail-response-schema');
const oar029ok = require('./OAR029/ok-response-schema');

beforeAll(async () => {
  linter = await linterForRule('openapi-custom:OAR029');
  return linter;
});

test('openapi-custom:OAR029 should find errors', () => {
  return linter.run(oar029fail).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].message).toBe('OAR046: Operation references undeclared global tags: other-tag.');
    expect(results[0].severity).toBe(0);
    expect(results[1].message).toBe('OAR046: Associate at least one tag to this operation.');
    expect(results[1].severity).toBe(0);
  });
});

test('openapi-custom:OAR029 should find no errors', () => {
  return linter.run(oar029ok).then((results) => {
    expect(results.length).toBe(0);
  });
});