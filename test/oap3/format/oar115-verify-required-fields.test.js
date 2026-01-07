const { linterForRule } = require('../../helpers/utils');

let linter;

const oar115fail = require('./OAR115/fail-example');
const oar115ok = require('./OAR115/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR115');
  return linter;
});

test('apiq:OAR115 should find errors', () => {
  return linter.run(oar115fail).then((results) => {
    expect(results.length).toBe(7);
  });
});

test('apiq:OAR115 should find no errors', () => {
  return linter.run(oar115ok).then((results) => {
    expect(results.length).toBe(0);
  });
});