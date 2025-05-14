const { linterForRule } = require('../../helpers/utils');

let linter;

const oar096fail = require('./OAR096/fail-403-example');
const oar096ok   = require('./OAR096/ok-403-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR096');
  return linter;
});

test('apiq:OAR096 should report missing 403 responses', () => {
  return linter.run(oar096fail).then((results) => {
    expect(results.length).toBeGreaterThan(1);
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR096 should pass when 403 is defined', () => {
  return linter.run(oar096ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
