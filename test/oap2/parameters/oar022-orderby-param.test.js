const { linterForRule } = require('../../helpers/utils');

let linter;

const oar022fail = require('./OAR022/fail-example');
const oar022ok = require('./OAR022/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR022');
  return linter;
});

test('apiq:OAR022 should find errors', () => {
  return linter.run(oar022fail).then((results) => {
    expect(results.length).toBe(4);
  });
});

test('apiq:OAR022 should find no errors', () => {
  return linter.run(oar022ok).then((results) => {
    expect(results.length).toBe(0);
  });
});