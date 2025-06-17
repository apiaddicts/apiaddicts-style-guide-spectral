const { linterForRule } = require('../../helpers/utils');

let linter;

const oar041fail = require('./OAR041/fail-example');
const oar041ok = require('./OAR041/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR041');
  return linter;
});

test('apiq:OAR041 should find errors', () => {
  return linter.run(oar041fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);   
  });
});

test('apiq:OAR041 should find no errors', () => {
  return linter.run(oar041ok).then((results) => {
    expect(results.length).toBe(0);  
  });
});
