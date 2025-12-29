const { linterForRule } = require('../../helpers/utils');

let linter;

const oar026fail = require('./OAR026/fail-$total-param');
const oar026ok = require('./OAR026/ok-$total-param');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR026');
  return linter;
});

test('apiq:OAR026 should find errors', () => {
  return linter.run(oar026fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR026 should find no errors', () => {
  return linter.run(oar026ok).then((results) => {
    expect(results.length).toBe(0);
  });
});