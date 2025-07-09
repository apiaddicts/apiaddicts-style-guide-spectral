const { linterForRule } = require('../../helpers/utils'); 

let linter;

const oar034fail = require('./OAR034/fail-example'); 
const oar034ok = require('./OAR034/ok-example'); 

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR034');
  return linter;
});

test('apiq:OAR034 should find errors', () => {
  return linter.run(oar034fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR034 should find no errors', () => {
  return linter.run(oar034ok).then((results) => {
    expect(results.length).toBe(0); 
  });
});
