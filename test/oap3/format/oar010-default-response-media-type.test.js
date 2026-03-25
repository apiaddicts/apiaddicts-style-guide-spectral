const { linterForRule } = require('../../helpers/utils');

let linter;

const oar010fail = require('./OAR010/fail-example');
const oar010ok = require('./OAR010/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR010');
  return linter;
});

test('apiq:OAR010 should find errors', () => {
  return linter.run(oar010fail).then((results) => {
    expect(results.length).toBe(8);
  });
});

test('apiq:OAR010 should find no errors', () => {
  return linter.run(oar010ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
