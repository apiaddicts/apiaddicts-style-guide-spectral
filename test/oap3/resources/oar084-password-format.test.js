const { linterForRule } = require('../../helpers/utils');

let linter;

const oar084fail = require('./OAR084/fail-example');
const oar084ok = require('./OAR084/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR084');
  return linter;
});

test('apiq:OAR084 should find errors', () => {
  return linter.run(oar084fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR084 should find no errors', () => {
  return linter.run(oar084ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
