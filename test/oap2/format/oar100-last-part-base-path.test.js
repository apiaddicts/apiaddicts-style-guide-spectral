const { linterForRule } = require('../../helpers/utils');

let linter;

const oar100fail = require('./OAR100/fail-example');
const oar100ok = require('./OAR100/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR100');
  return linter;
});

test('apiq:OAR100 should find errors', () => {
  return linter.run(oar100fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR100 should find no errors', () => {
  return linter.run(oar100ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
