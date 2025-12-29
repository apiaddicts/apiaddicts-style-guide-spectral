const { linterForRule } = require('../../helpers/utils');

let linter;

const oar052fail = require('./OAR052/fail-example');
const oar052ok = require('./OAR052/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR052');
  return linter;
});

test('apiq:OAR052 should find errors', () => {
  return linter.run(oar052fail).then((results) => {
    expect(results.length).toBe(11);
  });
});

test('apiq:OAR052 should find no errors', () => {
  return linter.run(oar052ok).then((results) => {
    expect(results.length).toBe(0);
  });
});