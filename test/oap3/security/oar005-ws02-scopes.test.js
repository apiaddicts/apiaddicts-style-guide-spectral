const { linterForRule } = require('../../helpers/utils');

let linter;

const oar005fail = require('./OAR005/fail-example'); 
const oar005ok = require('./OAR005/ok-example'); 

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR005'); 
  return linter;
});

test('apiq:OAR005 should find errors', () => {
  return linter.run(oar005fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1); 
    expect(results[0].message).toBe("OAR005: Scope in the operation must be defined correctly and match an existing scope.");
    expect(results[0].severity).toBe(0); 
  });
});

test('apiq:OAR005 should find no errors', () => {
  return linter.run(oar005ok).then((results) => {
    expect(results.length).toBe(0); 
  });
});
