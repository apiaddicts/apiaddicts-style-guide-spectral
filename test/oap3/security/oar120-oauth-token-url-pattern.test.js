const { linterForRule } = require('../../helpers/utils');

const oauthUrlPattern = require('../../../functions/apq-oauth-url-pattern');

const failExample = require('./OAR120/fail-example');
const okExample = require('./OAR120/ok-example');
const failRefs = require('./OAR120/fail-refs');
const okRefs = require('./OAR120/ok-refs');
const failPathFilter = require('./OAR120/fail-path-filter');
const okPathFilter = require('./OAR120/ok-path-filter');
const okNotEvaluated = require('./OAR120/ok-not-evaluated');
const failExample31 = require('./OAR120/fail-example-31');
const okExample31 = require('./OAR120/ok-example-31');
const failExample320 = require('./OAR120/fail-example-320');
const okExample320 = require('./OAR120/ok-example-320');

const RULE = 'apiq:OAR120';
const DEFAULT_PATTERN = '^https://[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)+(:[0-9]+)?(/[^/?#]+)*/token$';
const message = (url, flow, scheme, pattern = DEFAULT_PATTERN) => `OAR120: tokenUrl '${url}' of flow '${flow}' in security scheme '${scheme}' does not match the allowed pattern: ${pattern}`;
const urlAt = (scheme, flow, url, pattern) => [['components', 'securitySchemes', scheme, 'flows', flow, 'tokenUrl'], message(url, flow, scheme, pattern)];
const retail = (scheme, host) => urlAt(scheme, 'clientCredentials', `http://${host}.retail.example.com/token`);

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

describe('apiq:OAR120 - OpenAPI 3.0', () => {
  test('flags every tokenUrl outside the default pattern, on the URL, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      urlAt('WebOAuth', 'authorizationCode', 'http://login.identity.example.com/oauth/token'),
      urlAt('PasswordOAuth', 'password', 'https://localhost/token'),
      urlAt('QueryOAuth', 'clientCredentials', 'https://login.identity.example.com/oauth/token?grant=client'),
      urlAt('IntrospectOAuth', 'password', 'https://login.identity.example.com/oauth/token/introspect'),
      urlAt('CaseOAuth', 'clientCredentials', 'https://login.identity.example.com/OAuth/Token'),
      urlAt('EmptyOAuth', 'password', ''),
    ]));
  });

  test('accepts ports, tenants and realms in the path, and ignores refreshUrl, authorizationUrl, extension flows and other types', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows chained $refs and reports once on the final definition', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      urlAt('LegacyOAuthBase', 'password', 'https://legacy-login.travel.example.com/issue'),
      urlAt('AgencyOAuth', 'clientCredentials', 'http://corporate.travel.example.com/oauth/token'),
    ]));
  });

  test('ignores circular, dangling and undeclared references and follows $ref callbacks', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('skips the schemes applied only to the default excluded paths, callbacks included', async () => {
    expect(await findings(failPathFilter)).toEqual(sorted([
      retail('OrdersOAuth', 'orders'),
      retail('OrderEventsOAuth', 'order-events'),
      retail('StatusOAuth', 'status'),
      retail('V1HealthOAuth', 'v1-health'),
      retail('UnusedOAuth', 'unused'),
    ]));
    expect(await findings(failPathFilter, { paths: '' })).toHaveLength(8);
    expect(await findings(failPathFilter, { paths: '/orders', pathValidationStrategy: 'include' })).toEqual(sorted([
      retail('OrdersOAuth', 'orders'),
      retail('OrderEventsOAuth', 'order-events'),
    ]));
  });

  test('root security inherited only by excluded paths, security: [] and anonymous alternatives report nothing', async () => {
    expect(await findings(okPathFilter)).toEqual([]);
    expect(await findings(okPathFilter, { paths: '' })).toEqual(sorted([
      retail('MonitoringOAuth', 'monitoring'),
      retail('ProbeCallbackOAuth', 'probe'),
      retail('MeOAuth', 'me'),
    ]));
  });

  test('ignores non-string URLs, flows that are not objects, non-oauth2 schemes and extension flows', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
    expect(await findings(okNotEvaluated, { pattern: '^never$' })).toEqual([]);
  });
});

describe('apiq:OAR120 - pattern option', () => {
  test('a case-insensitive custom pattern replaces the default one and is echoed in the message', async () => {
    const pattern = '(?i)^https://login\\.identity\\.example\\.com/';
    expect(await findings(failExample, { pattern })).toEqual(sorted([
      urlAt('WebOAuth', 'authorizationCode', 'http://login.identity.example.com/oauth/token', pattern),
      urlAt('PasswordOAuth', 'password', 'https://localhost/token', pattern),
      urlAt('KeycloakOAuth', 'clientCredentials', 'https://sso.identity.example.com/realms/retail/protocol/openid-connect/token', pattern),
      urlAt('GoogleOAuth', 'authorizationCode', 'https://oauth2.googleapis.com/token', pattern),
      urlAt('AzureOAuth', 'clientCredentials', 'https://login.microsoftonline.com/contoso/oauth2/v2.0/token', pattern),
      urlAt('EmptyOAuth', 'password', '', pattern),
    ]));
  });

  test('an alternation of identity providers accepts all of them', async () => {
    const pattern = '^https://(login\\.microsoftonline\\.com/[^/]+/oauth2/v2\\.0|sso\\.identity\\.example\\.com/realms/[^/]+/protocol/openid-connect)/token$';
    const results = await findings(failExample, { pattern });
    expect(results.map(([path]) => path[2])).not.toEqual(expect.arrayContaining(['AzureOAuth']));
    expect(results.map(([path]) => path[2])).not.toEqual(expect.arrayContaining(['KeycloakOAuth']));
    expect(results).toHaveLength(8);
  });

  test('a blank, invalid, unsupported-flag or non-string pattern falls back to the default', async () => {
    const shipped = await findings(failExample);
    for (const pattern of ['', '  ', '[', '(?g)^https', true, []]) {
      expect(await findings(failExample, { pattern })).toEqual(shipped);
    }
  });
});

describe('apiq:OAR120 - OpenAPI 3.1', () => {
  test('evaluates webhooks, $ref path items, $ref with siblings and unused schemes', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      urlAt('ShipmentsOAuth', 'password', 'https://auth.logistics.example.com/token?audience=shipments'),
      urlAt('CarrierOAuthBase', 'clientCredentials', 'https://carriers/token'),
      urlAt('WebhookOAuth', 'clientCredentials', 'http://hooks.logistics.example.com/token'),
      urlAt('OrphanOAuth', 'password', 'https://auth.logistics.example.com/oauth/access_token'),
    ]));
  });

  test('excluding every path still evaluates webhooks and unused schemes', async () => {
    expect(await findings(failExample31, { paths: '**' })).toEqual(sorted([
      urlAt('WebhookOAuth', 'clientCredentials', 'http://hooks.logistics.example.com/token'),
      urlAt('OrphanOAuth', 'password', 'https://auth.logistics.example.com/oauth/access_token'),
    ]));
  });

  test('accepts compliant URLs next to mutualTLS schemes and nullable array-form types', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });
});

describe('apiq:OAR120 - OpenAPI 3.2', () => {
  test('checks deviceAuthorization tokenUrl and follows query, additionalOperations, URI and $self keys', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      urlAt('DeviceOAuth', 'deviceAuthorization', 'https://auth.home.example.com/device/tokens'),
      urlAt('LinkOAuth', 'clientCredentials', 'https://auth.home.example.com/token#mtls'),
      urlAt('FirmwareOAuth', 'password', 'https://auth.home.example.com/Token'),
      urlAt('ScenesOAuth', 'clientCredentials', 'http://legacy.home.example.com/token'),
    ]));
    expect(await findings(failExample320, { paths: '/firmware', pathValidationStrategy: '/include' })).toEqual([
      urlAt('FirmwareOAuth', 'password', 'https://auth.home.example.com/Token'),
    ]);
  });

  test('a scheme applied through a URI key only by an excluded path reports nothing', async () => {
    expect(await findings(okExample320)).toEqual([]);
    expect(await findings(okExample320, { paths: '' })).toEqual([urlAt('MonitoringOAuth', 'clientCredentials', 'http://monitoring/token')]);
  });
});

describe('apq-oauth-url-pattern function - tokenUrl', () => {
  test('falls back to the OAR120 code when the context has no rule name', () => {
    const doc = { swagger: '2.0', securityDefinitions: { App: { type: 'oauth2', flow: 'application', tokenUrl: 'http://x/token' } } };
    expect(oauthUrlPattern(doc, { field: 'tokenUrl' }, {})).toEqual([{
      message: `OAR120: tokenUrl 'http://x/token' of flow 'application' in security scheme 'App' does not match the allowed pattern: ${DEFAULT_PATTERN}`,
      path: ['securityDefinitions', 'App', 'tokenUrl'],
    }]);
  });
});
