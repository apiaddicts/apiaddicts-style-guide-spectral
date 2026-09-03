const { linterForRule } = require('../../helpers/utils');

let linter;

const oar075fail = require('./OAR075/fail-example');
const oar075ok = require('./OAR075/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR075');
  return linter;
});

test('apiq:OAR075 should find errors in Swagger 2.0, where parameters carry `type` directly', () => {
  return linter.run(oar075fail).then((results) => {
    expect(results.length).toBe(6);
  });
});

test('apiq:OAR075 should find no errors', () => {
  return linter.run(oar075ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
