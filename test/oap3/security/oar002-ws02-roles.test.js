const { linterForRule } = require('../../helpers/utils');

let linter;

const oar002fail = require('./OAR002/fail-example');
const oar002ok = require('./OAR002/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR002');
  return linter;
});

test('apiq:OAR002 should find errors', () => {
  return linter.run(oar002fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1); 
    expect(results[0].message).toBe("OAR002: Scope definition must include the 'key' attribute along with 'name' and 'roles'.");
    expect(results[0].severity).toBe(0);  
  });
});

test('apiq:OAR002 should find no errors', () => {
  return linter.run(oar002ok).then((results) => {
    expect(results.length).toBe(0);  // Se espera que no haya errores
  });
});

