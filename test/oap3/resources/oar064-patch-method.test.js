const { linterForRule } = require('../../helpers/utils');

let linter;

const oar064fail = require('./OAR064/fail-example');
const oar064ok = require('./OAR064/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR064');
  return linter;
});

test('apiq:OAR064 should find errors', () => {
  return linter.run(oar064fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR064 should find no errors', () => {
  return linter.run(oar064ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
