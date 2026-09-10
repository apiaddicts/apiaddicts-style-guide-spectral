const { linterForRule } = require('../../helpers/utils'); 

let linter;

const oar108fail = require('./OAR108/fail-example');
const oar108ok = require('./OAR108/ok-example');
const oar108failArray = require('./OAR108/fail-array-type-31');
const oar108okArray = require('./OAR108/ok-array-type-31');

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

test('apiq:OAR108 should inspect every path, operation and response code', () => {
  return linter.run(oar108failArray).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('apiq:OAR108 should find no errors with a compliant array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar108okArray).then((results) => {
    expect(results.length).toBe(0);
  });
});
