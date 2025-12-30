const { linterForRule } = require('../../helpers/utils');

let linter;

const oar053fail = require('./OAR053/fail-example');
const oar053ok = require('./OAR053/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR053');
  return linter;
});

test('apiq:OAR053 should find errors', () => {
  return linter.run(oar053fail).then((results) => {
    expect(results.length).toBe(6);
  });
});

test('apiq:OAR053 should find no errors', () => {
  return linter.run(oar053ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
