const { linterForRule } = require('../../helpers/utils');

let linter;

const oar074fail = require('./OAR074/fail-plain');
const oar074ok = require('./OAR074/ok-plain');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR074');
  return linter;
});

test('apiq:OAR074 should find errors', () => {
  return linter.run(oar074fail).then((results) => {
    expect(results.length).toBe(5);
  });
});

test('apiq:OAR074 should find no errors', () => {
  return linter.run(oar074ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
