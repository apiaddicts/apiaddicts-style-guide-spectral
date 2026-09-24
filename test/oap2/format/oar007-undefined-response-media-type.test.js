const { linterForRule } = require('../../helpers/utils');

let linter;

const oar007fail = require('./OAR007/fail-example');
const oar007ok = require('./OAR007/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR007');
  return linter;
});

test('apiq:OAR007 should find errors', () => {
  return linter.run(oar007fail).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('apiq:OAR007 should find no errors', () => {
  return linter.run(oar007ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
