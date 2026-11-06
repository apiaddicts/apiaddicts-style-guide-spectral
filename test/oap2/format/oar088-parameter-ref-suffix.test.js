const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR088/fail-example');
const okExample = require('./OAR088/ok-example');
const failRefs = require('./OAR088/fail-refs');
const okRefs = require('./OAR088/ok-refs');
const failReportedCase = require('./OAR088/fail-reported-case');
const okReportedCase = require('./OAR088/ok-reported-case');

const RULE = 'apiq:OAR088';
const at = (path, ref, suffix = 'Param') => [
  [...(Array.isArray(path) ? path : path.split(' ')), '$ref'],
  `OAR088: The parameter $ref '${ref}' must end with the suffix '${suffix}'.`,
];
const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const clone = (value) => JSON.parse(JSON.stringify(value));

let linter;
const linters = new Map();
const withOptions = async (functionOptions) => {
  const key = JSON.stringify(functionOptions);
  if (!linters.has(key)) linters.set(key, await linterForRule(RULE, { functionOptions }));
  return linters.get(key);
};
const findings = async (document, functionOptions) => {
  const custom = functionOptions === undefined ? linter : await withOptions(functionOptions);
  return sorted((await custom.run(document)).filter((r) => r.code === RULE).map((r) => [r.path.map(String), r.message]));
};

const CHECKED_IN_FAIL_EXAMPLE = [
  ['paths /pets parameters 0', '#/parameters/tenantHeader'],
  ['paths /pets parameters 1', '#/parameters/correlationIdParam'],
  ['paths /pets get parameters 0', '#/parameters/startSlate'],
  ['paths /pets get parameters 1', '#/parameters/limitParam'],
  ['paths /pets get parameters 2', '#/parameters/totalParam'],
  ['paths /pets get parameters 3', '#/parameters/speciesFilter'],
  ['paths /pets post parameters 1', '#/parameters/requestIdparam'],
  ['paths /pets/{petId} parameters 0', '#/parameters/petId'],
  ['paths /pets/{petId} get parameters 0', 'common.yaml#/parameters/localeParam'],
  ['paths /pets/{petId} put parameters 0', 'common.yaml#/parameters/ifMatch'],
  ['paths /pets/{petId} patch parameters 0', './parameters/ifMatchParam.yaml'],
  ['paths /pets/{petId} delete parameters 0', '#/parameters/reasonParameter'],
  ['paths /pets/{petId} head parameters 0', '#/parameters/etag'],
  ['paths /pets/{petId} options parameters 0', '#/parameters/originParam'],
  ['paths /owners get parameters 0', '#/parameters/limitParam'],
  ['paths /owners get parameters 1', '#/parameters/ownerNameParam'],
  ['parameters pageSizeParam', '#/parameters/limitParam'],
  ['parameters pageAlias', '#/parameters/pageSize'],
];
const expectedFor = (suffix, shown = suffix) => sorted(CHECKED_IN_FAIL_EXAMPLE
  .filter(([, ref]) => !ref.endsWith(suffix))
  .map(([path, ref]) => at(path, ref, shown)));

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR088 - Swagger 2.0', () => {
  test('the reported case: a parameter referenced as #/parameters/startSlate is reported on its $ref, as a warning', async () => {
    const results = (await linter.run(failReportedCase)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 1)).toBe(true);
    expect(await findings(failReportedCase)).toEqual([at('paths /customers get parameters 0', '#/parameters/startSlate')]);
  });

  test('the reported case with every $ref ending in Param is compliant', async () => {
    expect(await findings(okReportedCase)).toEqual([]);
  });

  test('flags path-item and operation parameters of every verb, literal external $refs and root parameters that are a $ref', async () => {
    expect(await findings(failExample)).toEqual(expectedFor('Param'));
  });

  test('ignores inline parameters, trace and x- keys, which are not Swagger 2.0 operations or paths, and schema properties named parameters', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows path item, parameter list and parameter $refs, reporting each $ref once where it is written', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      at('x-path-templates Results get parameters 0', '#/parameters/patientId'),
      at('paths /samples post parameters 0', '#/parameters/labId'),
      at('x-path-templates Samples get parameters 0', '#/parameters/sampleType'),
      at(['x-path-templates', 'Reports v2', 'get', 'parameters', '0'], '#/parameters/reportFormat'),
      at('x-path-templates /files/{fileId} parameters 0', '#/parameters/fileId'),
      at('x-shared-params pageParam', '#/x-shared-params/pageSize'),
      at('paths /panels get parameters 1', '#/parameters/loop'),
      at('parameters loop', '#/parameters/loop'),
      at('paths /panels get parameters 2', '#/parameters/missing'),
      at('parameters chainStartParam', '#/parameters/chainMiddle'),
      at('x-parameter-lists bulk 0', '#/parameters/bulkMode'),
    ]));
  });

  test('ignores circular, dangling and external path items and unreferenced templates', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('the suffix is compared literally and case-sensitively with the end of the whole $ref', async () => {
    const document = clone(okExample);
    document.paths['/owners'].get.parameters = [
      { $ref: '#/parameters/limitparam' },
      { $ref: '#/parameters/limitParam ' },
      { $ref: '#/parameters/limitParams' },
      { $ref: '#/parameters/Param' },
      { $ref: 'https://schemas.vetclinic.example.com/parameters/limitParam' },
      { $ref: 'https://schemas.vetclinic.example.com/parameters/limitParam.json' },
      { $ref: 42 },
      { $ref: null },
    ];
    expect(await findings(document)).toEqual(sorted([
      at('paths /owners get parameters 0', '#/parameters/limitparam'),
      at('paths /owners get parameters 1', '#/parameters/limitParam '),
      at('paths /owners get parameters 2', '#/parameters/limitParams'),
      at('paths /owners get parameters 5', 'https://schemas.vetclinic.example.com/parameters/limitParam.json'),
    ]));
  });

  test.each([
    ['Parameter', { 'default-suffix': 'Parameter' }, 'Parameter'],
    ['a padded value, trimmed', { 'default-suffix': '  Param\t' }, 'Param'],
    ['lowercase param, compared case-sensitively', { 'default-suffix': 'param' }, 'param'],
    ['the file extension .yaml', { 'default-suffix': '.yaml' }, '.yaml'],
    ['a regex-looking value, compared literally', { 'default-suffix': 'Param$' }, 'Param$'],
  ])('default-suffix %s', async (_label, options, suffix) => {
    expect(await findings(failExample, options)).toEqual(expectedFor(suffix));
  });

  test.each([
    ['an empty string', { 'default-suffix': '' }],
    ['only spaces', { 'default-suffix': '   ' }],
    ['null', { 'default-suffix': null }],
    ['a number', { 'default-suffix': 42 }],
    ['a list', { 'default-suffix': ['Parameter'] }],
    ['the match option of the old core pattern', { match: 'Parameter$' }],
  ])('default-suffix falls back to Param with %s', async (_label, options) => {
    expect(await findings(failExample, options)).toEqual(expectedFor('Param'));
  });
});
