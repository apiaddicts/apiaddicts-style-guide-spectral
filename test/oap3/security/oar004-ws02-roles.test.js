const { linterForRule } = require('../../helpers/utils');

let linter;

const oar004fail = require('./OAR004/fail-example');
const oar004ok = require('./OAR004/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR004');
  return linter;
});

test('apiq:OAR004 should find errors', () => {
  return linter.run(oar004fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].message).toBe("OAR004: Role should not contain forbidden characters (e.g. special characters like €, *, etc.).");
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR004 should find no errors', () => {
  return linter.run(oar004ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
