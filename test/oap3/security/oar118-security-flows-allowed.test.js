const { linterForRule } = require('../../helpers/utils');

const securityFlowsAllowed = require('../../../functions/apq-security-flows-allowed');

const failExample = require('./OAR118/fail-example');
const okExample = require('./OAR118/ok-example');
const failRefs = require('./OAR118/fail-refs');
const okRefs = require('./OAR118/ok-refs');
const failPathFilter = require('./OAR118/fail-path-filter');
const okPathFilter = require('./OAR118/ok-path-filter');
const okNotEvaluated = require('./OAR118/ok-not-evaluated');
const failExample31 = require('./OAR118/fail-example-31');
const okExample31 = require('./OAR118/ok-example-31');
const failPathFilter31 = require('./OAR118/fail-path-filter-31');
const okPathFilter31 = require('./OAR118/ok-path-filter-31');
const failExample320 = require('./OAR118/fail-example-320');
const okExample320 = require('./OAR118/ok-example-320');
const failPathFilter320 = require('./OAR118/fail-path-filter-320');
const okPathFilter320 = require('./OAR118/ok-path-filter-320');

const RULE = 'apiq:OAR118';
const DEFAULT_ALLOWED = 'authorizationCode, clientCredentials';
const message = (flow, scheme, allowed = DEFAULT_ALLOWED) => `OAR118: Flow '${flow}' of security scheme '${scheme}' is not allowed. Allowed flows: ${allowed}.`;
const flowAt = (scheme, flow, allowed) => [['components', 'securitySchemes', scheme, 'flows', flow], message(flow, scheme, allowed)];

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

describe('apiq:OAR118 - OpenAPI 3.0', () => {
  test('flags every flow outside the allowed list, on the scheme definition, as an error', async () => {
    const results = await linter.run(failExample);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      flowAt('CustomerOAuth', 'implicit'),
      flowAt('CustomerOAuth', 'password'),
      flowAt('CampaignsOAuth', 'implicit'),
    ]));
  });

  test('accepts allowed flows, extension keys in flows and non-oauth2 schemes', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows chained $refs and reports once on the final definition', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      flowAt('LegacyOAuthBase', 'implicit'),
      flowAt('AgencyOAuth', 'password'),
    ]));
  });

  test('ignores circular, dangling and undeclared references and follows $ref callbacks', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('skips the schemes applied only to the default excluded paths, callbacks included', async () => {
    expect(await findings(failPathFilter)).toEqual(sorted([
      flowAt('OrdersOAuth', 'implicit'),
      flowAt('OrderEventsOAuth', 'password'),
      flowAt('StatusOAuth', 'password'),
      flowAt('V1HealthOAuth', 'password'),
      flowAt('UnusedOAuth', 'implicit'),
    ]));
  });

  test('an empty paths option excludes nothing', async () => {
    expect(await findings(failPathFilter, { paths: '' })).toEqual(sorted([
      flowAt('HealthOAuth', 'password'),
      flowAt('ProbeCallbackOAuth', 'password'),
      flowAt('MeOAuth', 'implicit'),
      flowAt('OrdersOAuth', 'implicit'),
      flowAt('OrderEventsOAuth', 'password'),
      flowAt('StatusOAuth', 'password'),
      flowAt('V1HealthOAuth', 'password'),
      flowAt('UnusedOAuth', 'implicit'),
    ]));
  });

  test('/include only evaluates the schemes applied to the listed paths and their callbacks', async () => {
    expect(await findings(failPathFilter, { paths: '/health', pathValidationStrategy: '/include' })).toEqual(sorted([
      flowAt('HealthOAuth', 'password'),
      flowAt('ProbeCallbackOAuth', 'password'),
    ]));
    expect(await findings(failPathFilter, { paths: '/orders', pathValidationStrategy: 'INCLUDE' })).toEqual(sorted([
      flowAt('OrdersOAuth', 'implicit'),
      flowAt('OrderEventsOAuth', 'password'),
    ]));
  });

  test('a ** pattern excludes the path at any depth', async () => {
    expect(await findings(failPathFilter, { paths: '**/health' })).toEqual(sorted([
      flowAt('MeOAuth', 'implicit'),
      flowAt('OrdersOAuth', 'implicit'),
      flowAt('OrderEventsOAuth', 'password'),
      flowAt('StatusOAuth', 'password'),
      flowAt('UnusedOAuth', 'implicit'),
    ]));
  });

  test('root security inherited only by excluded paths, security: [] and anonymous alternatives report nothing', async () => {
    expect(await findings(okPathFilter)).toEqual([]);
    expect(await findings(okPathFilter, { paths: '' })).toEqual(sorted([
      flowAt('MonitoringOAuth', 'password'),
      flowAt('ProbeCallbackOAuth', 'password'),
      flowAt('MeOAuth', 'implicit'),
    ]));
  });

  test('ignores non-oauth2 schemes, the Swagger 2.0 flow field, blank and extension flow keys and unusable flows', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
    expect(await findings(okNotEvaluated, { 'allowed-flows': 'deviceAuthorization' })).toEqual([]);
  });
});

describe('apiq:OAR118 - allowed-flows option', () => {
  test('a custom list replaces the default one and is echoed in the message', async () => {
    const allowed = 'implicit, password';
    expect(await findings(failExample, { 'allowed-flows': 'implicit,password' })).toEqual(sorted([
      flowAt('CustomerOAuth', 'authorizationCode', allowed),
      flowAt('PartnerOAuth', 'clientCredentials', allowed),
    ]));
  });

  test('an array behaves like the comma-separated list', async () => {
    expect(await findings(failExample, { 'allowed-flows': ['implicit', 'password'] }))
      .toEqual(await findings(failExample, { 'allowed-flows': 'implicit,password' }));
  });

  test('names are case-insensitive and the Swagger 2.0 names are equivalent to the OpenAPI 3 ones', async () => {
    expect(await findings(failExample, { 'allowed-flows': 'AUTHORIZATIONCODE,ClientCredentials,IMPLICIT,Password' })).toEqual([]);
    expect(await findings(failExample, { 'allowed-flows': 'accessCode, application' })).toEqual(sorted([
      flowAt('CustomerOAuth', 'implicit', 'accessCode, application'),
      flowAt('CustomerOAuth', 'password', 'accessCode, application'),
      flowAt('CampaignsOAuth', 'implicit', 'accessCode, application'),
    ]));
  });

  test('a blank or unusable value falls back to the default list', async () => {
    const shipped = await findings(failExample);
    expect(await findings(failExample, { 'allowed-flows': '' })).toEqual(shipped);
    expect(await findings(failExample, { 'allowed-flows': ' , ,' })).toEqual(shipped);
    expect(await findings(failExample, { 'allowed-flows': 42 })).toEqual(shipped);
  });
});

describe('apiq:OAR118 - OpenAPI 3.1', () => {
  test('evaluates webhooks, $ref path items, $ref with siblings and schemes used only by unreferenced path items', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      flowAt('ShipmentsOAuth', 'implicit'),
      flowAt('CarrierOAuthBase', 'implicit'),
      flowAt('WebhookOAuth', 'password'),
      flowAt('OrphanOAuth', 'password'),
    ]));
  });

  test('accepts allowed flows next to mutualTLS schemes and nullable array-form types', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });

  test('with the default exclusions every scheme is evaluated', async () => {
    expect(await findings(failPathFilter31)).toEqual(sorted([
      flowAt('ShipmentsOAuth', 'implicit'),
      flowAt('EventsOAuth', 'password'),
      flowAt('CarriersOAuth', 'implicit'),
      flowAt('WebhookOAuth', 'password'),
      flowAt('UnusedOAuth', 'implicit'),
    ]));
  });

  test('/include never evaluates webhooks or unused schemes', async () => {
    expect(await findings(failPathFilter31, { paths: '/shipments/**', pathValidationStrategy: '/include' })).toEqual(sorted([
      flowAt('ShipmentsOAuth', 'implicit'),
      flowAt('EventsOAuth', 'password'),
    ]));
    expect(await findings(failPathFilter31, { paths: '/shipments/*', pathValidationStrategy: '/include' })).toEqual([]);
    expect(await findings(failPathFilter31, { paths: '**', pathValidationStrategy: '/include' })).toEqual(sorted([
      flowAt('ShipmentsOAuth', 'implicit'),
      flowAt('EventsOAuth', 'password'),
      flowAt('CarriersOAuth', 'implicit'),
    ]));
  });

  test('excluding every path still evaluates webhooks and unused schemes', async () => {
    expect(await findings(failPathFilter31, { paths: '**' })).toEqual(sorted([
      flowAt('WebhookOAuth', 'password'),
      flowAt('UnusedOAuth', 'implicit'),
    ]));
  });

  test('a URI requirement key is not a reference before 3.2', async () => {
    expect(await findings(okPathFilter31, { paths: '/shipments/**', pathValidationStrategy: '/include' })).toEqual([]);
    expect(await findings(okPathFilter31)).toEqual(sorted([
      flowAt('CarriersOAuth', 'implicit'),
      flowAt('WebhookOAuth', 'password'),
      flowAt('UnusedOAuth', 'implicit'),
      flowAt('UriOnlyOAuth', 'implicit'),
    ]));
  });
});

describe('apiq:OAR118 - OpenAPI 3.2', () => {
  test('flags deviceAuthorization and follows query, additionalOperations, URI and $self keys and deprecated schemes', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      flowAt('DeviceOAuth', 'deviceAuthorization'),
      flowAt('LinkOAuth', 'password'),
      flowAt('FirmwareOAuth', 'implicit'),
      flowAt('ScenesOAuth', 'password'),
      flowAt('LegacyOAuth', 'implicit'),
    ]));
  });

  test('deviceAuthorization can be allowed like any other flow', async () => {
    const allowed = 'authorizationCode, clientCredentials, deviceAuthorization';
    expect(await findings(failExample320, { 'allowed-flows': 'authorizationCode,clientCredentials,deviceAuthorization' })).toEqual(sorted([
      flowAt('LinkOAuth', 'password', allowed),
      flowAt('FirmwareOAuth', 'implicit', allowed),
      flowAt('ScenesOAuth', 'password', allowed),
      flowAt('LegacyOAuth', 'implicit', allowed),
    ]));
  });

  test('URI and $self requirement keys count as usages of the referenced scheme', async () => {
    expect(await findings(failExample320, { paths: '/firmware', pathValidationStrategy: '/include' })).toEqual([flowAt('FirmwareOAuth', 'implicit')]);
    expect(await findings(failExample320, { paths: '/scenes', pathValidationStrategy: '/include' })).toEqual([flowAt('ScenesOAuth', 'password')]);
  });

  test('accepts allowed flows applied through URI keys', async () => {
    expect(await findings(okExample320)).toEqual([]);
    expect(await findings(okExample320, { paths: '/devices', pathValidationStrategy: '/include' })).toEqual([]);
  });

  test('a scheme is skipped only when every usage is excluded, external and missing URIs are ignored', async () => {
    expect(await findings(failPathFilter320)).toEqual(sorted([
      flowAt('SharedOAuth', 'password'),
      flowAt('LinkOAuth', 'implicit'),
    ]));
    expect(await findings(failPathFilter320, { paths: '' })).toEqual(sorted([
      flowAt('HealthOAuth', 'password'),
      flowAt('StatusOAuth', 'password'),
      flowAt('MeOAuth', 'implicit'),
      flowAt('SharedOAuth', 'password'),
      flowAt('LinkOAuth', 'implicit'),
    ]));
  });

  test('schemes used only by excluded query and additionalOperations report nothing', async () => {
    expect(await findings(okPathFilter320)).toEqual([]);
    expect(await findings(okPathFilter320, { paths: '' })).toEqual(sorted([
      flowAt('HealthOAuth', 'password'),
      flowAt('StatusOAuth', 'password'),
      flowAt('MeOAuth', 'implicit'),
    ]));
  });
});

describe('apq-security-flows-allowed function', () => {
  const context = { path: [], rule: { name: 'apiq:OAR118' } };

  test('returns nothing for a value that is not an OpenAPI document', () => {
    expect(securityFlowsAllowed(null, {}, context)).toEqual([]);
    expect(securityFlowsAllowed(['openapi'], {}, context)).toEqual([]);
    expect(securityFlowsAllowed({ info: { title: 'No version' } }, {}, context)).toEqual([]);
  });

  test('works without document inventory, raw document or rule name', () => {
    const results = securityFlowsAllowed({
      openapi: 3.1,
      components: { securitySchemes: { Legacy: { type: 'oauth2', flows: { implicit: {} } } } },
    }, undefined, {});
    expect(results).toEqual([{
      message: message('implicit', 'Legacy'),
      path: ['components', 'securitySchemes', 'Legacy', 'flows', 'implicit'],
    }]);
  });
});
