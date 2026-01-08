const { linterForRule } = require('../../helpers/utils');

let linter;

const oar052fail = require('./OAR042/fail-example');
const oar052ok = require('./OAR042/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR042');
  return linter;
});

test('apiq:OAR042 should find errors', () => {
  return linter.run(oar052fail).then((results) => {
    expect(results[0].message).toBe("OAR042: Base path must follow the '/api-<name>/v<version>' standard.");
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR042 should find no errors', () => {
  return linter.run(oar052ok).then((results) => {
    expect(results.length).toBe(0);
  });
});