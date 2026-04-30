const { linterForRule } = require('../../helpers/utils');

let linter;

const oar008fail = require('./OAR008/fail-example');
const oar008ok = require('./OAR008/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR008');
  return linter;
});

test('apiq:OAR008 should find errors', () => {
  return linter.run(oar008fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR008 should find no errors', () => {
  return linter.run(oar008ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
