const { linterForRule } = require('../../helpers/utils');

let linter;

const oar113fail = require('./OAR113/fail-example');
const oar113ok = require('./OAR113/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR113');
  return linter;
});

test('apiq:OAR113 should find errors', () => {
  return linter.run(oar113fail).then((results) => {
    expect(results.length).toBe(6);
  });
});

test('apiq:OAR113 should find no errors', () => {
  return linter.run(oar113ok).then((results) => {
    expect(results.length).toBe(0);
  });
});