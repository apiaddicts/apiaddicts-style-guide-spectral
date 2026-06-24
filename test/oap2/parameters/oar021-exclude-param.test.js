const { linterForRule } = require('../../helpers/utils');

let linter;

const oar021fail = require('./OAR021/fail-example');
const oar021ok   = require('./OAR021/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR021');
  return linter;
});

test('apiq:OAR021 should find errors', () => {
  return linter.run(oar021fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR021 should find no errors', () => {
  return linter.run(oar021ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
