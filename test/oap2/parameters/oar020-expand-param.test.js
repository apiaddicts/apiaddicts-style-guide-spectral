const { linterForRule } = require('../../helpers/utils');

let linter;

const oar020fail = require('./OAR020/fail-example');
const oar020ok   = require('./OAR020/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR020');
  return linter;
});

test('apiq:OAR020 should find errors', () => {
  return linter.run(oar020fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR020 should find no errors', () => {
  return linter.run(oar020ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
