const { linterForRule } = require('../../helpers/utils');

let linter;

const oar045failMissingSchema = require('./OAR045/fail-missing-schema');
const oar045okSchemaPresent = require('./OAR045/ok-schema-present');
const oar045ok204Exempt = require('./OAR045/ok-204-exempt');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR045');
  return linter;
});

test('apiq:OAR045 flags a Swagger 2.0 response with no schema', () => {
  return linter.run(oar045failMissingSchema).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path).toEqual(['paths', '/pets', 'get', 'responses', '200']);
  });
});

test('apiq:OAR045 does not flag a Swagger 2.0 response with a schema present', () => {
  return linter.run(oar045okSchemaPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR045 does not flag a 204 response with no schema', () => {
  return linter.run(oar045ok204Exempt).then((results) => {
    expect(results.length).toBe(0);
  });
});
