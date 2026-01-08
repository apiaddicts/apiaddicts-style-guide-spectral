const { linterForRule } = require('../../helpers/utils');

let linter;

const oar114fail = require('./OAR114/fail-example');
const oar114ok = require('./OAR114/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR114');
  return linter;
});

test('apiq:OAR114 should find errors', () => {
  return linter.run(oar114fail).then((results) => {
    expect(results.length).toBe(4);
  });
});

test('apiq:OAR114 should find no errors', () => {
  return linter.run(oar114ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
