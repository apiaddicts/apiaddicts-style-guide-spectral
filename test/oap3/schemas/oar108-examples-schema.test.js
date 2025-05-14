const { linterForRule } = require('../../helpers/utils'); 

let linter;

const oar108fail = require('./OAR108/fail-example'); 
const oar108ok = require('./OAR108/ok-example'); 

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR108');
  return linter;
});

test('apiq:OAR108 should find errors', () => {
  return linter.run(oar108fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR108 should find no errors', () => {
  return linter.run(oar108ok).then((results) => {
    expect(results.length).toBe(0); 
  });
});
