const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR012/fail-example');
const okExample = require('./OAR012/ok-example');

const RULE = 'apiq:OAR012';
const MESSAGE = 'OAR012: Path params, query params, object names and property names must follow the configured naming convention.';

const at = (path) => path.split(' ');
const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const asDocument = (fixture, name) => new Document(JSON.stringify(fixture, null, 2), Parsers.Json, name);

const EXPECTED = sorted([
  at('paths /pets/{petId} parameters 0 name'),
  at('paths /pets/{petId} get parameters 0 name'),
  at('paths /pets/{petId} get responses 200 schema allOf 1 properties petName'),
  at('paths /pets/{petId} post parameters 0 schema properties birthDate'),
  at('paths /pets/{petId} post parameters 0 schema properties owner properties ownerEmail'),
  at('paths /pets/{petId} post responses 201 schema items properties newId'),
  at('parameters pageSize name'),
  at('parameters unused_body schema properties bodyField'),
  at('responses error_response schema properties errorCode'),
  at('definitions base_pet properties tagList'),
  at('definitions base_pet properties tagList items properties tagName'),
  at('definitions base_pet properties extra additionalProperties properties extraKey'),
  at('definitions PetOwner'),
]);

let linter;
const findings = async (document) => {
  const results = (await linter.run(document)).filter((r) => r.code === RULE);
  results.forEach((r) => expect(r.message).toBe(MESSAGE));
  return sorted(results.map((r) => r.path));
};

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR012 - OpenAPI 2.0', () => {
  test('checks path and query parameters, body schemas, root parameters and responses, allOf and definitions names', async () => {
    expect(await findings(failExample)).toEqual(EXPECTED);
    expect(await findings(asDocument(failExample, 'pets.json'))).toEqual(EXPECTED);
  });

  test('ignores header and formData parameters, response headers, examples and extensions', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('applies the configured naming-convention', async () => {
    const camel = await linterForRule(RULE, { functionOptions: { 'naming-convention': 'camelCase' } });
    const results = (await camel.run(okExample)).filter((r) => r.code === RULE).map((r) => r.path.join(' '));
    expect(results).toContain('paths /pets/{pet_id} parameters 0 name');
    expect(results).toContain('definitions pet_owner');
    expect((await camel.run(failExample)).filter((r) => r.code === RULE).map((r) => r.path.join(' '))).not.toContain('definitions base_pet properties tagList');
  });
});
