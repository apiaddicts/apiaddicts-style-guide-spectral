const { linterForRule } = require('../../helpers/utils');

let linter;

const oar046fail = require('./OAR046/fail-undeclared-tag');
const oar046ok = require('./OAR046/ok-declared-tag');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR046');
  return linter;
});

test('apiq:OAR046 should find errors', () => {
  return linter.run(oar046fail).then((results) => {
    expect(results.length).toBeGreaterThan(1);
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR046 should find no errors', () => {
  return linter.run(oar046ok).then((results) => {
    expect(results.length).toBe(0);
  });
});