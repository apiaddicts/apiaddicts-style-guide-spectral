const { linterForRule } = require('../../helpers/utils');

let linter;

const oar091fail = require('./OAR091/fail-example');
const oar091ok = require('./OAR091/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR091');
  return linter;
});

test('apiq:OAR091 should find errors', () => {
  return linter.run(oar091fail).then((results) => {
    expect(results.length).toBe(7);
  });
});

test('apiq:OAR091 should find no errors', () => {
  return linter.run(oar091ok).then((results) => {
    expect(results.length).toBe(0);
  });
});