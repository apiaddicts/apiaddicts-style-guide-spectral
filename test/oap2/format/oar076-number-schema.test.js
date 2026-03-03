const { linterForRule } = require('../../helpers/utils');

let linter;

const oar076fail = require('./OAR076/fail-example');
const oar076ok = require('./OAR076/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR076');
  return linter;
});

test('apiq:OAR076 should find errors', () => {
  return linter.run(oar076fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR076 should find no errors', () => {
  return linter.run(oar076ok).then((results) => {
    expect(results.length).toBe(0);
  });
});