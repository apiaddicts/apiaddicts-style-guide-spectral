const { linterForRule } = require('../../helpers/utils');

let linter;

const oar039fail = require('./OAR039/fail-example');
const oar039ok = require('./OAR039/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR039');
  return linter;
});

test('apiq:OAR039 should find errors', () => {
  return linter.run(oar039fail).then((results) => {
    expect(results.length).toBe(18);
  });
});

test('apiq:OAR039 should find no errors', () => {
  return linter.run(oar039ok).then((results) => {
    expect(results.length).toBe(0);
  });
});