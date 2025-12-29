const { linterForRule } = require('../../helpers/utils');

let linter;

const oar068fail = require('./OAR068/fail-example');
const oar068ok   = require('./OAR068/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR068');
  return linter;
});

test('apiq:OAR068 should find errors', () => {
  return linter.run(oar068fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR068 should find no errors', () => {
  return linter.run(oar068ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
