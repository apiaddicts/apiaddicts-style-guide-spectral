const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR067/fail-example');
const okExample = require('./OAR067/ok-example');
const failReportedCase = require('./OAR067/fail-reported-case');
const okReportedCase = require('./OAR067/ok-reported-case');

const RULE = 'apiq:OAR067';
const MESSAGE = 'OAR067: RequestBody and Responses schema property names must be compliant with the camelCase naming convention.';
const sorted = (paths) => [...paths].sort();
const clone = (value) => JSON.parse(JSON.stringify(value));

let linter;
const linters = new Map();
const withOptions = async (functionOptions) => {
  const key = JSON.stringify(functionOptions);
  if (!linters.has(key)) linters.set(key, await linterForRule(RULE, { functionOptions }));
  return linters.get(key);
};
const run = async (document, functionOptions) => {
  const custom = functionOptions === undefined ? linter : await withOptions(functionOptions);
  return (await custom.run(document)).filter((r) => r.code === RULE);
};
const findings = async (document, functionOptions) => sorted((await run(document, functionOptions)).map((r) => r.path.join(' ')));

const FAIL_EXAMPLE = [
  'definitions Address properties street_name',
  'definitions AppointmentRequest properties slot_start',
  'definitions Clinic properties opening_hours',
  'definitions Error properties error_code',
  'definitions MedicalHistory properties vaccinations items properties vaccine_code',
  'definitions Owner properties home_address',
  'definitions Owner properties work_address',
  'definitions Paging properties total_count',
  'definitions Pet properties Birth_Date',
  'definitions Pet properties attributes additionalProperties properties attr_value',
  'definitions Pet properties pet_id',
  'definitions Pet properties tags items properties tag_name',
  'definitions ValidationErrors properties field_errors',
  'paths /owners head responses 200 schema properties head_check',
  'paths /owners options responses 200 schema properties allowed_verbs',
  'paths /pets get responses 200 schema allOf 1 properties result_count',
  'paths /pets post parameters 0 schema properties Medical_History',
  'paths /pets post parameters 0 schema properties pet_name',
  'paths /pets/{petId} parameters 1 schema properties update_reason',
  'paths /pets/{petId}/photos post responses 201 schema properties photo_url',
];

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR067 - OpenAPI 2.0', () => {
  test('the reported case: coberturaORLA is reported on its own name, never on the referenced coberturaOrlaEnum', async () => {
    const results = await run(failReportedCase);
    expect(results.every((r) => r.severity === 1 && r.message === MESSAGE)).toBe(true);
    expect(await findings(failReportedCase)).toEqual(sorted([
      'definitions cheapestSolution properties coberturaORLA',
      'definitions cheapestSolution properties gvalAQS',
      'definitions cheapestSolution properties zonaORLA',
    ]));
  });

  test('the reported case with camelCase names is compliant', async () => {
    expect(await findings(okReportedCase)).toEqual([]);
  });

  test('checks body parameters of operations and path items, response schemas, every method and what they reference', async () => {
    expect(await findings(failExample)).toEqual(sorted(FAIL_EXAMPLE));
  });

  test('ignores query, header and formData parameters, x- paths and responses, examples, unused definitions, parameters and responses', async () => {
    const paths = (await findings(failExample)).join('\n');
    ['page_size', 'photo_file', 'cache_key', 'internal_only', 'unused_prop', 'unused_param_prop', 'unused_response_prop'].forEach((name) => {
      expect(paths).not.toContain(name);
    });
  });

  test('the example with camelCase names is compliant', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('a body parameter declared once in the root parameters is reported once, on its definition', async () => {
    const document = clone(okExample);
    document.definitions.Owner.properties.loyalty_tier = { type: 'string' };
    expect(await findings(document)).toEqual(['definitions Owner properties loyalty_tier']);
  });

  test('a document without paths is ignored', async () => {
    const document = clone(failExample);
    delete document.paths;
    expect(await findings(document)).toEqual([]);
  });

  test('the naming-convention option applies to Swagger 2.0 too', async () => {
    expect(await findings(okReportedCase, { 'naming-convention': 'UpperCamelCase' })).toEqual(sorted([
      'definitions cheapestSolution properties capex',
      'definitions cheapestSolution properties coberturaOrla',
      'definitions cheapestSolution properties gvalAqs',
      'definitions cheapestSolution properties nearNet',
      'definitions cheapestSolution properties opex',
      'definitions cheapestSolution properties proveedorUltimaMilla',
      'definitions cheapestSolution properties red',
      'definitions cheapestSolution properties zonaOrla',
    ]));
    expect(await findings(failReportedCase, { 'naming-convention': '  camelcase ' })).toHaveLength(3);
    expect(await findings(failReportedCase, { 'naming-convention': 'kebab-case' })).toEqual(sorted([
      'definitions cheapestSolution properties coberturaORLA',
      'definitions cheapestSolution properties gvalAQS',
      'definitions cheapestSolution properties nearNet',
      'definitions cheapestSolution properties proveedorUltimaMilla',
      'definitions cheapestSolution properties zonaORLA',
    ]));
    expect(await findings(failExample, { 'naming-convention': 'snake_case' })).toEqual(sorted([
      'definitions Address properties zipCode',
      'definitions AppointmentRequest properties petRef',
      'definitions Clinic properties clinicId',
      'definitions MedicalHistory properties vaccinations items properties appliedAt',
      'definitions Owner properties ownerId',
      'definitions Owner properties preferredClinic',
      'definitions Paging properties nextPage',
      'definitions Pet properties Birth_Date',
      'definitions Pet properties parentPet',
      'paths /owners get responses 200 schema properties ownersById',
      'paths /pets post parameters 0 schema properties Medical_History',
      'paths /pets post parameters 0 schema properties ownerId',
      'paths /pets/{petId} parameters 1 schema properties weightKg',
      'paths /pets/{petId}/photos post responses 201 schema properties photoId',
    ]));
  });
});
