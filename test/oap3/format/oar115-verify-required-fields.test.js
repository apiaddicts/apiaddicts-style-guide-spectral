const { linterForRule } = require('../../helpers/utils');

let linter;

const oar115fail = require('./OAR115/fail-example');
const oar115ok = require('./OAR115/ok-example');
const oar115arrayType31 = require('./OAR115/fail-array-type-31');
const oar115schemaLocations = require('./OAR115/fail-schema-locations');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR115');
  return linter;
});

test('apiq:OAR115 should find errors', () => {
  return linter.run(oar115fail).then((results) => {
    expect(results.length).toBe(7);
  });
});

test('apiq:OAR115 should find no errors', () => {
  return linter.run(oar115ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR115 should apply to 3.1 array-form object type', () => {
  return linter.run(oar115arrayType31).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR115 should reach every schema location, not just components', () => {
  return linter.run(oar115schemaLocations).then((results) => {
    expect(results.length).toBe(6);
  });
});