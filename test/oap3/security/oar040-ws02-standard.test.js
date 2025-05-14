const { linterForRule } = require('../../helpers/utils');

let linter;

const oar040fail = require('./OAR040/fail-example');
const oar040ok = require('./OAR040/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR040');
  return linter;
});

test('apiq:OAR040 should find errors', () => {
  return linter.run(oar040fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].message).toBe("OAR040: Scope name must follow the 'apfc_sc_' prefix standard.");
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR040 should find no errors', () => {
  return linter.run(oar040ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
