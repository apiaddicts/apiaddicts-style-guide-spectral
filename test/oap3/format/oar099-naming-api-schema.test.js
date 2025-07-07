const { linterForRule } = require('../../helpers/utils');

let linter;

const oar099fail = require('./OAR099/fail-example');  
const oar099ok = require('./OAR099/ok-example');  

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR099');
  return linter;
});

test('apiq:OAR099 should find errors', () => {
  return linter.run(oar099fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);   
  });
});

test('apiq:OAR099 should find no errors', () => {
  return linter.run(oar099ok).then((results) => {
    expect(results.length).toBe(0); 
  });
});
