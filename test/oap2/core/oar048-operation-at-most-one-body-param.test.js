const { linterForRule } = require('../../helpers/utils');

let linter;

const oar048fail = require('./OAR048/fail-example');
const oar048ok = require('./OAR048/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR048');
  return linter;
});

test('apiq:OAR048 should find errors', () => {
  return linter.run(oar048fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR048 should find no errors', () => {
  return linter.run(oar048ok).then((results) => {
    expect(results.length).toBe(0);
  });
});