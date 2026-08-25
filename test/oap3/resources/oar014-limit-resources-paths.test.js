const { linterForRule } = require('../../helpers/utils');

let linter;

const oar014fail = require('./OAR014/fail-example');
const oar014ok = require('./OAR014/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR014');
  return linter;
});

test('apiq:OAR014 should find errors', () => {
  return linter.run(oar014fail).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('apiq:OAR014 should find no errors', () => {
  return linter.run(oar014ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR014 message reflects the configured min/max-level range', async () => {
  const customLinter = await linterForRule('apiq:OAR014', {
    functionOptions: { 'min-level': 4, 'max-level': 6, ignoreSegments: ['me'] },
  });
  const results = await customLinter.run(oar014fail);
  expect(results.length).toBeGreaterThanOrEqual(1);
  expect(results[0].message).toContain('range 4-6');
});