const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR118/fail-example');
const okExample = require('./OAR118/ok-example');
const failRefs = require('./OAR118/fail-refs');
const okRefs = require('./OAR118/ok-refs');
const failPathFilter = require('./OAR118/fail-path-filter');
const okPathFilter = require('./OAR118/ok-path-filter');
const okNotEvaluated = require('./OAR118/ok-not-evaluated');

const RULE = 'apiq:OAR118';
const DEFAULT_ALLOWED = 'authorizationCode, clientCredentials';
const message = (flow, scheme, allowed = DEFAULT_ALLOWED) => `OAR118: Flow '${flow}' of security scheme '${scheme}' is not allowed. Allowed flows: ${allowed}.`;
const flowAt = (scheme, flow, allowed) => [['securityDefinitions', scheme, 'flow'], message(flow, scheme, allowed)];

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

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

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR118 - Swagger 2.0', () => {
  test('flags the flow field of oauth2 definitions outside the allowed list, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      flowAt('petstore_auth', 'implicit'),
      flowAt('OwnerPassword', 'password'),
    ]));
  });

  test('accessCode and application match the default authorizationCode and clientCredentials', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('a single allowed flow flags every other one, Swagger 2.0 aliases included', async () => {
    expect(await findings(failExample, { 'allowed-flows': 'authorizationCode' })).toEqual(sorted([
      flowAt('petstore_auth', 'implicit', 'authorizationCode'),
      flowAt('OwnerPassword', 'password', 'authorizationCode'),
      flowAt('ClinicApp', 'application', 'authorizationCode'),
    ]));
  });

  test('the Swagger 2.0 names can be listed directly and are case-insensitive', async () => {
    expect(await findings(failExample, { 'allowed-flows': 'IMPLICIT, password, accessCode, Application' })).toEqual([]);
  });

  test('follows chained $refs in securityDefinitions and refs out of them', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      flowAt('OwnerOAuthBase', 'implicit'),
      flowAt('SharedOAuth', 'password'),
    ]));
  });

  test('ignores circular, dangling and undeclared references', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('skips the definitions applied only to the default excluded paths, matched exactly', async () => {
    expect(await findings(failPathFilter)).toEqual(sorted([
      flowAt('StatusOAuth', 'password'),
      flowAt('MyPetsOAuth', 'implicit'),
      flowAt('VisitsOAuth', 'implicit'),
      flowAt('UnusedOAuth', 'password'),
    ]));
  });

  test('a /me/** pattern also excludes the sub-paths', async () => {
    expect(await findings(failPathFilter, { paths: '/me/**,/health,/status' })).toEqual(sorted([
      flowAt('StatusOAuth', 'password'),
      flowAt('VisitsOAuth', 'implicit'),
      flowAt('UnusedOAuth', 'password'),
    ]));
  });

  test('/include evaluates the root security inherited by the listed paths', async () => {
    expect(await findings(failPathFilter, { paths: '/health', pathValidationStrategy: '/include' })).toEqual([
      flowAt('MonitoringOAuth', 'password'),
    ]);
  });

  test('root security inherited only by excluded paths, security: [] and anonymous alternatives report nothing', async () => {
    expect(await findings(okPathFilter)).toEqual([]);
    expect(await findings(okPathFilter, { paths: '' })).toEqual(sorted([
      flowAt('MonitoringOAuth', 'password'),
      flowAt('MeOAuth', 'implicit'),
    ]));
  });

  test('ignores the OpenAPI 3 flows field, unusable flow values and non-oauth2 definitions', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });
});
