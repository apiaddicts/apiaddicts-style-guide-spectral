const { linterForRule } = require('../../helpers/utils');

let linter;

const oar079fail = require('./OAR079/fail-parameter-404-response');
const oar079ok = require('./OAR079/ok-parameter-404-response');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR079');
  return linter;
});

test('apiq:OAR079 should find errors', () => {
  return linter.run(oar079fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR079 should find no errors', () => {
  return linter.run(oar079ok).then((results) => {
    expect(results.length).toBe(0);
  });
});