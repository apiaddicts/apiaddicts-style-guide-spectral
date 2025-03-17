const { linterForRule } = require('../../helpers/utils');

let linter;

const oar003fail = require('./OAR003/fail-example');
const oar003ok = require('./OAR003/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR003');
  return linter;
});

test('apiq:OAR003 should find errors', () => {
  return linter.run(oar003fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].message).toBe("OAR003: Scope must define a 'description' attribute.");
    expect(results[0].severity).toBe(0);
  });
});

test('apiq:OAR003 should find no errors', () => {
  return linter.run(oar003ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
