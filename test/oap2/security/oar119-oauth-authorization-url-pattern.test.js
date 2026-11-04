const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR119/fail-example');
const okExample = require('./OAR119/ok-example');
const failRefs = require('./OAR119/fail-refs');
const okRefs = require('./OAR119/ok-refs');
const failPathFilter = require('./OAR119/fail-path-filter');
const okPathFilter = require('./OAR119/ok-path-filter');
const okNotEvaluated = require('./OAR119/ok-not-evaluated');

const RULE = 'apiq:OAR119';
const DEFAULT_PATTERN = '^https://[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)+(:[0-9]+)?(/[^/?#]+)*/authorize$';
const message = (url, flow, scheme, pattern = DEFAULT_PATTERN) => `OAR119: authorizationUrl '${url}' of flow '${flow}' in security scheme '${scheme}' does not match the allowed pattern: ${pattern}`;
const urlAt = (scheme, flow, url, pattern) => [['securityDefinitions', scheme, 'authorizationUrl'], message(url, flow, scheme, pattern)];
const clinic = (scheme, name) => urlAt(scheme, 'implicit', `http://${name}.petclinic.example.com/authorize`);

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

describe('apiq:OAR119 - Swagger 2.0', () => {
  test('flags the authorizationUrl of every oauth2 definition outside the default pattern, whatever its flow', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      urlAt('petstore_auth', 'implicit', 'http://auth.petclinic.example.com/oauth/authorize'),
      urlAt('VetAccessCode', 'accessCode', 'https://auth.petclinic.example.com/oauth/dialog'),
      urlAt('ClinicApp', 'application', 'https://petclinic/authorize'),
    ]));
  });

  test('accepts compliant URLs and ignores tokenUrl and other types', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('a custom pattern is applied to every definition', async () => {
    const pattern = '^https://portal\\.petclinic\\.example\\.com/';
    expect(await findings(failExample, { pattern })).toEqual(sorted([
      urlAt('petstore_auth', 'implicit', 'http://auth.petclinic.example.com/oauth/authorize', pattern),
      urlAt('VetAccessCode', 'accessCode', 'https://auth.petclinic.example.com/oauth/dialog', pattern),
      urlAt('ClinicApp', 'application', 'https://petclinic/authorize', pattern),
    ]));
    expect(await findings(okExample, { pattern })).toEqual(sorted([
      urlAt('VetAccessCode', 'accessCode', 'https://auth.petclinic.example.com/oauth/authorize', pattern),
      urlAt('OwnerImplicit', 'implicit', 'https://auth.petclinic.example.com:8443/authorize', pattern),
    ]));
  });

  test('follows chained $refs in securityDefinitions and refs out of them', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      urlAt('OwnerOAuthBase', 'implicit', 'https://legacy.petclinic.example.com/login'),
      urlAt('SharedOAuth', 'accessCode', 'http://corporate.petclinic.example.com/authorize'),
    ]));
  });

  test('ignores circular, dangling and undeclared references', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('skips the definitions applied only to the default excluded paths, matched exactly', async () => {
    expect(await findings(failPathFilter)).toEqual(sorted([
      clinic('StatusOAuth', 'status'),
      clinic('MyPetsOAuth', 'pets'),
      clinic('VisitsOAuth', 'visits'),
      clinic('UnusedOAuth', 'unused'),
    ]));
    expect(await findings(failPathFilter, { paths: '/me/**,/health,/status' })).toEqual(sorted([
      clinic('StatusOAuth', 'status'),
      clinic('VisitsOAuth', 'visits'),
      clinic('UnusedOAuth', 'unused'),
    ]));
    expect(await findings(failPathFilter, { paths: '/health', pathValidationStrategy: '/include' })).toEqual([
      clinic('MonitoringOAuth', 'monitoring'),
    ]);
  });

  test('root security inherited only by excluded paths, security: [] and anonymous alternatives report nothing', async () => {
    expect(await findings(okPathFilter)).toEqual([]);
    expect(await findings(okPathFilter, { paths: '' })).toEqual(sorted([
      clinic('MonitoringOAuth', 'monitoring'),
      clinic('MeOAuth', 'me'),
    ]));
  });

  test('ignores the OpenAPI 3 flows field, non-string URLs and non-oauth2 definitions', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });
});
