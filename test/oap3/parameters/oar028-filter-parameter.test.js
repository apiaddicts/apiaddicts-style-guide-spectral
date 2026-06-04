const { linterForRule } = require('../../helpers/utils');

let linter;

const oar028fail = require('./OAR028/fail-example');
const oar028ok = require('./OAR028/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR028');
  return linter;
});

test('apiq:OAR028 should find errors', () => {
  return linter.run(oar028fail).then((results) => {
    expect(results.length).toBe(10);
  });
});

test('apiq:OAR028 should find no errors', () => {
  return linter.run(oar028ok).then((results) => {
    expect(results.length).toBe(0);
  });
});