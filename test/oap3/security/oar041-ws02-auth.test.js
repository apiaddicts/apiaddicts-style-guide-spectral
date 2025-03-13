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
    expect(results[0].message).toBe("OAR041:Scopes must be defined in `x-wso2-security` at the end of the document, before the paths.");
    expect(results[0].severity).toBe(0);  
  });
});

test('apiq:OAR041 should find no errors', () => {
  return linter.run(oar041ok).then((results) => {
    expect(results.length).toBe(0);  
  });
});
