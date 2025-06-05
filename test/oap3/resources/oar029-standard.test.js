const { linterForRule } = require('../../helpers/utils');

let linter;

const oar029fail = require('./OAR029/invalid');
const oar029ok = require('./OAR029/valid');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR029');
  return linter;
});

test('apiq:OAR029 should find errors', () => {
  return linter.run(oar029fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR029 should find no errors', () => {
  return linter.run(oar029ok).then((results) => {
    expect(results.length).toBe(0);
  });
});