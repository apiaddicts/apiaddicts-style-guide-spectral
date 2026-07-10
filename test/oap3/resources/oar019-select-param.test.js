const { linterForRule } = require('../../helpers/utils');

let linter;

const oar019fail = require('./OAR019/fail-example');
const oar019ok   = require('./OAR019/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR019');
  return linter;
});

test('apiq:OAR019 should find errors', () => {
  return linter.run(oar019fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR019 should find no errors', () => {
  return linter.run(oar019ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
