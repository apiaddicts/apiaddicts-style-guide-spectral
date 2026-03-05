const { linterForRule } = require('../../helpers/utils');

let linter;

const oar031fail = require('./OAR031/fail-example');
const oar031ok = require('./OAR031/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR031');
  return linter;
});

test('apiq:OAR031 should find errors', () => {
  return linter.run(oar031fail).then((results) => {
    expect(results.length).toBe(4);
  });
});

test('apiq:OAR031 should find no errors', () => {
  return linter.run(oar031ok).then((results) => {
    expect(results.length).toBe(0);
  });
});