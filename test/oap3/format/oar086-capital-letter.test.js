const { linterForRule } = require('../../helpers/utils');

let linter;

const oar086fail = require('./OAR086/fail-capital');
const oar086ok = require('./OAR086/ok-capital');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR086');
  return linter;
});

test('apiq:OAR086 should find errors', () => {
  return linter.run(oar086fail).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('apiq:OAR086 should find no errors', () => {
  return linter.run(oar086ok).then((results) => {
    expect(results.length).toBe(0);
  });
});