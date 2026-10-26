const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR120/fail-example');
const okExample = require('./OAR120/ok-example');
const failRefs = require('./OAR120/fail-refs');
const okRefs = require('./OAR120/ok-refs');
const failPathFilter = require('./OAR120/fail-path-filter');
const okPathFilter = require('./OAR120/ok-path-filter');
const okNotEvaluated = require('./OAR120/ok-not-evaluated');

const RULE = 'apiq:OAR120';
const DEFAULT_PATTERN = '^https://[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)+(:[0-9]+)?(/[^/?#]+)*/token$';
const message = (url, flow, scheme, pattern = DEFAULT_PATTERN) => `OAR120: tokenUrl '${url}' of flow '${flow}' in security scheme '${scheme}' does not match the allowed pattern: ${pattern}`;
const urlAt = (scheme, flow, url, pattern) => [['securityDefinitions', scheme, 'tokenUrl'], message(url, flow, scheme, pattern)];
const clinic = (scheme, name) => urlAt(scheme, 'password', `http://${name}.petclinic.example.com/token`);

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

describe('apiq:OAR120 - Swagger 2.0', () => {
  test('flags the tokenUrl of every oauth2 definition outside the default pattern, whatever its flow', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      urlAt('OwnerPassword', 'password', 'http://auth.petclinic.example.com/oauth/token'),
      urlAt('VetAccessCode', 'accessCode', 'https://auth.petclinic.example.com/oauth/access'),
      urlAt('ClinicApp', 'application', 'https://petclinic/token'),
      urlAt('petstore_auth', 'implicit', 'http://implicit-has-no-token-url.example.com/token'),
    ]));
  });

  test('accepts compliant URLs and ignores authorizationUrl and other types', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('a custom pattern is applied to every definition', async () => {
    const pattern = '(?i)^https://AUTH\\.petclinic\\.example\\.com/';
    expect(await findings(okExample, { pattern })).toEqual([
      urlAt('ClinicApp', 'application', 'https://auth.petclinic.example.com:8443/token', pattern),
    ]);
    expect(await findings(failExample, { pattern })).toEqual(sorted([
      urlAt('OwnerPassword', 'password', 'http://auth.petclinic.example.com/oauth/token', pattern),
      urlAt('ClinicApp', 'application', 'https://petclinic/token', pattern),
      urlAt('petstore_auth', 'implicit', 'http://implicit-has-no-token-url.example.com/token', pattern),
      urlAt('PortalAuth', 'accessCode', 'https://portal.petclinic.example.com/token', pattern),
    ]));
  });

  test('follows chained $refs in securityDefinitions and refs out of them', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      urlAt('OwnerOAuthBase', 'password', 'https://legacy.petclinic.example.com/issue'),
      urlAt('SharedOAuth', 'application', 'http://corporate.petclinic.example.com/token'),
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
