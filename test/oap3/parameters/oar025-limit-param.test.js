const { linterForRule } = require('../../helpers/utils');

let linter;

const oar025fail = require('./OAR025/fail-example');
const oar025ok = require('./OAR025/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR025');
  return linter;
});

test('apiq:OAR025 should find errors', () => {
  return linter.run(oar025fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR025 should find no errors', () => {
  return linter.run(oar025ok).then((results) => {
    expect(results.length).toBe(0);
  });
});