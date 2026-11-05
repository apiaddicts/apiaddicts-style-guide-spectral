const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR080/fail-example');
const okExample = require('./OAR080/ok-example');
const failRefs = require('./OAR080/fail-refs');
const okRefs = require('./OAR080/ok-refs');
const okReportedCase = require('./OAR080/ok-reported-case');

const RULE = 'apiq:OAR080';
const at = (path, scheme) => [
  [...path.map(String), scheme],
  `OAR080: Security scheme '${scheme}' is not defined in securityDefinitions.`,
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
  return sorted((await custom.run(document)).filter((r) => r.code === RULE).map((r) => [r.path, r.message]));
};

const FAIL_EXAMPLE_OPERATIONS = [
  at(['paths', '/accounts/{accountId}', 'put', 'security', 0], 'auditKey'),
  at(['paths', '/accounts/{accountId}', 'patch', 'security', 0], 'ChannelKey'),
  at(['paths', '/accounts/{accountId}', 'delete', 'security', 1], 'legacyKey'),
  at(['paths', '/accounts/{accountId}', 'head', 'security', 0], 'undeclaredScheme'),
  at(['paths', '/accounts/{accountId}', 'options', 'security', 1], 'atmKey'),
  at(['paths', '/accounts/{accountId}/statements', 'get', 'security', 0], '#/securityDefinitions/channelKey'),
];

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR080 - Swagger 2.0', () => {
  test('the reported case: apiKeyAuth is defined in securityDefinitions, so the root and the operations are compliant', async () => {
    expect(await findings(okReportedCase)).toEqual([]);
  });

  test('flags every name of the root security and of the operations that is not defined, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      at(['security', 3], 'branchKey'),
      ...FAIL_EXAMPLE_OPERATIONS,
    ]));
  });

  test('accepts defined names with any scopes, AND combinations, anonymous alternatives, security: [] and inherited security', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('a scheme defined in securityDefinitions is valid even if the root security does not use it', async () => {
    const document = clone(okExample);
    document.security = [{ bankOAuth: [] }];
    expect(await findings(document)).toEqual([]);
  });

  test('ignores trace, query and callbacks, which are not Swagger 2.0 operations, x- paths and unreferenced path items', async () => {
    const document = clone(okExample);
    const pathItem = document.paths['/accounts/{accountId}'];
    pathItem.options = pathItem.trace;
    expect(await findings(document)).toEqual([at(['paths', '/accounts/{accountId}', 'options', 'security', 0], 'undeclaredScheme')]);
  });

  test('follows chained local $refs and reports once where the key is written, sibling operations included', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      at(['x-path-items', 'Cards', 'get', 'security', 0], 'processorKey'),
      at(['paths', '/cards/{cardId}/blocks', 'post', 'security', 0], 'branchBasic'),
      at(['x-path-items', 'Blocks', 'delete', 'security', 2], 'vaultKey'),
      at(['x-path-items', 'Pin Changes', 'put', 'security', 0], 'pinPad'),
    ]));
  });

  test('ignores circular, dangling and unreferenced path items', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test.each([
    ['without root security', undefined],
    ['with security: []', []],
    ['with only an anonymous requirement', [{}]],
    ['with an object instead of a list', { branchKey: [] }],
    ['with requirements that are not objects', ['branchKey', null, [{ branchKey: [] }]]],
  ])('keeps checking the operations %s', async (_label, security) => {
    const document = clone(failExample);
    if (security === undefined) delete document.security;
    else document.security = security;
    expect(await findings(document)).toEqual(sorted(FAIL_EXAMPLE_OPERATIONS));
  });

  test('without securityDefinitions every name used is reported, in the root and in the operations', async () => {
    const document = clone(okReportedCase);
    delete document.securityDefinitions;
    expect(await findings(document)).toEqual(sorted([
      at(['security', 0], 'apiKeyAuth'),
      at(['paths', '/customers', 'get', 'security', 0], 'apiKeyAuth'),
      at(['paths', '/customers/{customerId}', 'get', 'security', 0], 'apiKeyAuth'),
      at(['paths', '/customers/{customerId}', 'delete', 'security', 0], 'apiKeyAuth'),
    ]));
  });

  test('reports nothing in a document that is not Swagger or OpenAPI', async () => {
    const document = clone(failExample);
    delete document.swagger;
    expect(await findings(document)).toEqual([]);
  });

  test('ignores any option, such as the allowedTypes list the back builds from the legacy expected-security-scheme param', async () => {
    const shipped = await findings(failExample);
    for (const options of [{ allowedTypes: ['auditKey', 'legacyKey'] }, { 'expected-security-scheme': 'oauth2, apiKey' }, { match: '^(apiKey|oauth2)$' }]) {
      expect(await findings(failExample, options)).toEqual(shipped);
    }
  });
});
