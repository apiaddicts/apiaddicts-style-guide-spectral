const { linterForRule } = require('../../helpers/utils');

let linter;

const oar016fail = require('./OAR016/fail-example');
const oar016ok = require('./OAR016/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR016');
  return linter;
});

test('apiq:OAR016 should find errors', () => {
  return linter.run(oar016fail).then((results) => {
    expect(results.length).toBeGreaterThan(0);
  });
});

test('apiq:OAR016 should find no errors', () => {
  return linter.run(oar016ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
