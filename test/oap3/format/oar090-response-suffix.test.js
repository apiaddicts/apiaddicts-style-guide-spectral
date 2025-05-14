const { linterForRule } = require('../../helpers/utils');

let linter;

const oar090fail = require('./OAR090/fail-example');  
const oar090ok = require('./OAR090/ok-example');  

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR090');
  return linter;
});

test('apiq:OAR090 should find errors', () => {
  return linter.run(oar090fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);   
  });
});

test('apiq:OAR090 should find no errors', () => {
  return linter.run(oar090ok).then((results) => {
    expect(results.length).toBe(0); 
  });
});
