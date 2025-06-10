const { linterForRule } = require('../../helpers/utils');

let linter;

const oar051fail = require('./OAR051/fail-descriptions');
const oar051ok = require('./OAR051/ok-descriptions');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR051');
  return linter;
});

test('apiq:OAR051 should find errors', () => {
  return linter.run(oar051fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR051 should find no errors', () => {
  return linter.run(oar051ok).then((results) => {
    expect(results.length).toBe(0);
  });
});