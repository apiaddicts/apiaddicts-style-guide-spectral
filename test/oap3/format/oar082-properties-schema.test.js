const { linterForRule } = require('../../helpers/utils');

let linter;

const oar082fail = require('./OAR082/fail-properties-schema');
const oar082ok = require('./OAR082/ok-properties-schema');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR082');
  return linter;
});

test('apiq:OAR082 should find errors', () => {
  return linter.run(oar082fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR082 should find no errors', () => {
  return linter.run(oar082ok).then((results) => {
    expect(results.length).toBe(0);
  });
});