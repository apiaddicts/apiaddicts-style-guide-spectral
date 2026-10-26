const { linterForRule } = require('../../helpers/utils');

const oauthUrlPattern = require('../../../functions/apq-oauth-url-pattern');

const failExample = require('./OAR119/fail-example');
const okExample = require('./OAR119/ok-example');
const failRefs = require('./OAR119/fail-refs');
const okRefs = require('./OAR119/ok-refs');
const failPathFilter = require('./OAR119/fail-path-filter');
const okPathFilter = require('./OAR119/ok-path-filter');
const okNotEvaluated = require('./OAR119/ok-not-evaluated');
const failExample31 = require('./OAR119/fail-example-31');
const okExample31 = require('./OAR119/ok-example-31');
const failExample320 = require('./OAR119/fail-example-320');
const okExample320 = require('./OAR119/ok-example-320');

const RULE = 'apiq:OAR119';
const DEFAULT_PATTERN = '^https://[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)+(:[0-9]+)?(/[^/?#]+)*/authorize$';
const message = (url, flow, scheme, pattern = DEFAULT_PATTERN) => `OAR119: authorizationUrl '${url}' of flow '${flow}' in security scheme '${scheme}' does not match the allowed pattern: ${pattern}`;
const urlAt = (scheme, flow, url, pattern) => [['components', 'securitySchemes', scheme, 'flows', flow, 'authorizationUrl'], message(url, flow, scheme, pattern)];
const retail = (scheme, host) => urlAt(scheme, 'implicit', `http://${host}.retail.example.com/authorize`);

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

const FAIL_EXAMPLE_DEFAULT = [
  urlAt('WebOAuth', 'authorizationCode', 'http://login.identity.example.com/oauth/authorize'),
  urlAt('MobileOAuth', 'implicit', 'https://localhost/authorize'),
  urlAt('KeycloakOAuth', 'authorizationCode', 'https://sso.identity.example.com/realms/retail/protocol/openid-connect/auth'),
  urlAt('QueryOAuth', 'authorizationCode', 'https://login.identity.example.com/oauth/authorize?prompt=login'),
  urlAt('SlashOAuth', 'implicit', 'https://login.identity.example.com/oauth/authorize/'),
  urlAt('CaseOAuth', 'authorizationCode', 'HTTPS://LOGIN.identity.example.com/oauth/authorize'),
  urlAt('EmptyOAuth', 'implicit', ''),
  urlAt('RelativeOAuth', 'authorizationCode', '/oauth/authorize'),
];

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR119 - OpenAPI 3.0', () => {
  test('flags every authorizationUrl outside the default pattern, on the URL, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted(FAIL_EXAMPLE_DEFAULT));
  });

  test('accepts ports, tenants in the path and short paths, and ignores other URLs, extension flows and other types', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows chained $refs and reports once on the final definition', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      urlAt('LegacyOAuthBase', 'implicit', 'https://legacy-login.travel.example.com/login'),
      urlAt('AgencyOAuth', 'authorizationCode', 'http://corporate.travel.example.com/oauth/authorize'),
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
  });

  test('an empty paths option excludes nothing and /include only checks the listed paths', async () => {
    expect(await findings(failPathFilter, { paths: '' })).toHaveLength(8);
    expect(await findings(failPathFilter, { paths: '/health', pathValidationStrategy: '/include' })).toEqual(sorted([
      retail('HealthOAuth', 'health'),
      retail('ProbeCallbackOAuth', 'probe'),
    ]));
    expect(await findings(failPathFilter, { paths: '**/health' })).toEqual(sorted([
      retail('MeOAuth', 'me'),
      retail('OrdersOAuth', 'orders'),
      retail('OrderEventsOAuth', 'order-events'),
      retail('StatusOAuth', 'status'),
      retail('UnusedOAuth', 'unused'),
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

describe('apiq:OAR119 - pattern option', () => {
  test('a case-insensitive custom pattern replaces the default one and is echoed in the message', async () => {
    const pattern = '(?i)^https://[a-z0-9.-]+/';
    expect(await findings(failExample, { pattern })).toEqual(sorted([
      urlAt('WebOAuth', 'authorizationCode', 'http://login.identity.example.com/oauth/authorize', pattern),
      urlAt('PortOAuth', 'authorizationCode', 'https://login.identity.example.com:8443/oauth/authorize', pattern),
      urlAt('EmptyOAuth', 'implicit', '', pattern),
      urlAt('RelativeOAuth', 'authorizationCode', '/oauth/authorize', pattern),
    ]));
  });

  test('the pattern is trimmed and matched without anchors unless it writes them', async () => {
    const pattern = '^https://login\\.identity\\.example\\.com/';
    const results = await findings(failExample, { pattern: `  ${pattern}  ` });
    expect(results.map(([, text]) => text.split("'")[5]).sort()).toEqual([
      'CaseOAuth', 'EmptyOAuth', 'KeycloakOAuth', 'MobileOAuth', 'PortOAuth', 'RelativeOAuth', 'TenantOAuth', 'WebOAuth',
    ]);
    expect(results.every(([, text]) => text.endsWith(`allowed pattern: ${pattern}`))).toBe(true);
    expect(await findings(failExample, { pattern: 'identity\\.example' })).toEqual(sorted([
      urlAt('EmptyOAuth', 'implicit', '', 'identity\\.example'),
      urlAt('RelativeOAuth', 'authorizationCode', '/oauth/authorize', 'identity\\.example'),
      urlAt('MobileOAuth', 'implicit', 'https://localhost/authorize', 'identity\\.example'),
      urlAt('TenantOAuth', 'authorizationCode', 'https://login.microsoftonline.com/contoso/oauth2/v2.0/authorize', 'identity\\.example'),
    ]));
  });

  test('a blank, invalid, unsupported-flag or non-string pattern falls back to the default', async () => {
    const shipped = await findings(failExample);
    for (const pattern of ['', '   ', '(', '(?x)^https', 42, null]) {
      expect(await findings(failExample, { pattern })).toEqual(shipped);
    }
  });
});

describe('apiq:OAR119 - OpenAPI 3.1', () => {
  test('evaluates webhooks, $ref path items, $ref with siblings and unused schemes', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      urlAt('ShipmentsOAuth', 'implicit', 'https://auth.logistics.example.com/authorize?audience=shipments'),
      urlAt('CarrierOAuthBase', 'authorizationCode', 'https://carriers/authorize'),
      urlAt('WebhookOAuth', 'implicit', 'http://hooks.logistics.example.com/authorize'),
      urlAt('OrphanOAuth', 'implicit', 'https://auth.logistics.example.com/login'),
    ]));
  });

  test('/include never evaluates webhooks or unused schemes', async () => {
    expect(await findings(failExample31, { paths: '/shipments', pathValidationStrategy: '/include' })).toEqual([
      urlAt('ShipmentsOAuth', 'implicit', 'https://auth.logistics.example.com/authorize?audience=shipments'),
    ]);
  });

  test('accepts compliant URLs next to mutualTLS schemes and nullable array-form types', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });
});

describe('apiq:OAR119 - OpenAPI 3.2', () => {
  test('follows query, additionalOperations, URI and $self keys and deprecated schemes; deviceAuthorizationUrl is not checked', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      urlAt('DeviceOAuth', 'authorizationCode', 'https://auth.home.example.com/oauth/authorise'),
      urlAt('LinkOAuth', 'implicit', 'https://auth.home.example.com/authorize#consent'),
      urlAt('FirmwareOAuth', 'implicit', 'https://auth.home.example.com/Authorize'),
      urlAt('ScenesOAuth', 'implicit', 'http://legacy.home.example.com/authorize'),
    ]));
    expect(await findings(failExample320, { paths: '/scenes', pathValidationStrategy: '/include' })).toEqual([
      urlAt('ScenesOAuth', 'implicit', 'http://legacy.home.example.com/authorize'),
    ]);
  });

  test('a scheme applied through a URI key only by an excluded path reports nothing', async () => {
    expect(await findings(okExample320)).toEqual([]);
    expect(await findings(okExample320, { paths: '' })).toEqual([urlAt('MonitoringOAuth', 'implicit', 'http://monitoring/authorize')]);
  });
});

describe('apq-oauth-url-pattern function', () => {
  const context = { path: [], rule: { name: 'apiq:OAR119' } };
  const doc = {
    openapi: '3.0.3',
    components: { securitySchemes: { Legacy: { type: 'oauth2', flows: { implicit: { authorizationUrl: 'http://x/authorize' } } } } },
  };

  test('returns nothing for a value that is not an OpenAPI document or an unknown field', () => {
    expect(oauthUrlPattern(null, { field: 'authorizationUrl' }, context)).toEqual([]);
    expect(oauthUrlPattern({ info: {} }, { field: 'authorizationUrl' }, context)).toEqual([]);
    expect(oauthUrlPattern(doc, { field: 'refreshUrl' }, context)).toEqual([]);
    expect(oauthUrlPattern(doc, {}, context)).toEqual([]);
  });

  test('works without document inventory, raw document or rule name', () => {
    expect(oauthUrlPattern(doc, { field: 'authorizationUrl' }, {})).toEqual([{
      message: message('http://x/authorize', 'implicit', 'Legacy'),
      path: ['components', 'securitySchemes', 'Legacy', 'flows', 'implicit', 'authorizationUrl'],
    }]);
  });
});
