const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR099/fail-example');
const okExample = require('./OAR099/ok-example');
const failBasePath = require('./OAR099/fail-base-path');
const okBasePath = require('./OAR099/ok-base-path');

const RULE = 'apiq:OAR099';
const MESSAGE = "OAR099: API name must start with prefix 'api-'.";

const clone = (value) => JSON.parse(JSON.stringify(value));
const withBasePath = (basePath) => ({ ...clone(okBasePath), basePath });

let linter;
const findings = async (document) => (await linter.run(document)).filter((r) => r.code === RULE);
const paths = async (document) => (await findings(document)).map((r) => r.path.map(String));

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

test('apiq:OAR099 should find errors in the documented Swagger 2.0 example', async () => {
  const results = await findings(failExample);
  expect(results.map((r) => r.path)).toEqual([['basePath']]);
  expect(results[0].message).toBe(MESSAGE);
});

test('apiq:OAR099 should find no errors in the documented Swagger 2.0 example', async () => {
  expect(await findings(okExample)).toEqual([]);
});

describe('OAR099 on the Swagger 2.0 basePath', () => {
  test('only the basePath is reported, never the path keys, the host or extensions', async () => {
    expect(await paths(failBasePath)).toEqual([['basePath']]);
  });

  test('a compliant basePath with unprefixed /status and resource paths reports nothing', async () => {
    expect(Object.keys(okBasePath.paths)).toContain('/status');
    expect(await findings(okBasePath)).toEqual([]);
  });

  test('a document without basePath has nothing to check', async () => {
    const document = clone(okBasePath);
    delete document.basePath;
    expect(await findings(document)).toEqual([]);
  });

  test.each([null, 42, true, ['/api-x/v1'], { path: '/api-x/v1' }])('a non-string basePath %p is ignored', async (basePath) => {
    expect(await findings(withBasePath(basePath))).toEqual([]);
  });

  test.each([
    '/api-policy-administration/v2',
    '/api-policy-administration',
    '/api-policy-administration/',
    '/api-policy-administration/internal/v2',
    '/api-p',
    '/api-2/v1',
    '/api-{product}/v1',
  ])('%s is compliant', async (basePath) => {
    expect(await findings(withBasePath(basePath))).toEqual([]);
  });

  test.each([
    '/policy-administration/v2',
    '/v2/api-policy-administration',
    '/insurance/api-policy-administration/v2',
    '/api-',
    '/api-/v2',
    '/API-policy-administration/v2',
    '/apipolicy-administration/v2',
    '/api_policy_administration/v2',
    '//api-policy-administration/v2',
    '/{apiName}/v2',
    'api-policy-administration/v2',
    '/',
    '',
  ])('%s is reported once', async (basePath) => {
    expect(await paths(withBasePath(basePath))).toEqual([['basePath']]);
  });
});

describe('OAR099 on very large Swagger 2.0 documents', () => {
  const largeDocument = (basePath) => {
    const document = withBasePath(basePath);
    document.paths = {};
    for (let index = 0; index < 5000; index += 1) {
      document.paths[`/branches/{branchId}/policies-${index}/{policyId}`] = {
        get: { responses: { 200: { description: 'Policy' } } },
      };
    }
    return document;
  };

  test('thousands of unprefixed paths report nothing with a compliant basePath', async () => {
    expect(await findings(largeDocument('/api-policy-administration/v2'))).toEqual([]);
  });

  test('thousands of paths report only the noncompliant basePath', async () => {
    expect(await paths(largeDocument('/policy-administration/v2'))).toEqual([['basePath']]);
  });
});
