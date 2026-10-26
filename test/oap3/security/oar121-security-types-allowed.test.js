const { linterForRule } = require('../../helpers/utils');

const securityTypesAllowed = require('../../../functions/apq-security-types-allowed');

const failExample = require('./OAR121/fail-example');
const okExample = require('./OAR121/ok-example');
const failRefs = require('./OAR121/fail-refs');
const okRefs = require('./OAR121/ok-refs');
const failPathFilter = require('./OAR121/fail-path-filter');
const okPathFilter = require('./OAR121/ok-path-filter');
const okNotEvaluated = require('./OAR121/ok-not-evaluated');
const failExample31 = require('./OAR121/fail-example-31');
const okExample31 = require('./OAR121/ok-example-31');
const failExample320 = require('./OAR121/fail-example-320');
const okExample320 = require('./OAR121/ok-example-320');

const RULE = 'apiq:OAR121';
const DEFAULT_ALLOWED = 'oauth2, bearer';
const typeAt = (scheme, type, allowed = DEFAULT_ALLOWED) => [
  ['components', 'securitySchemes', scheme, 'type'],
  `OAR121: Security scheme '${scheme}' type '${type}' is not allowed. Allowed types: ${allowed}.`,
];
const httpAt = (scheme, httpScheme, allowed = DEFAULT_ALLOWED) => [
  ['components', 'securitySchemes', scheme, 'scheme'],
  `OAR121: Security scheme '${scheme}' type 'http' with scheme '${httpScheme}' is not allowed. Allowed types: ${allowed}.`,
];

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

describe('apiq:OAR121 - OpenAPI 3.0', () => {
  test('flags every scheme type outside the default list, on type or on the http scheme, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      httpAt('LegacyBasic', 'basic'),
      httpAt('DigestAuth', 'digest'),
      typeAt('HeaderKey', 'apiKey'),
      typeAt('CorporateSso', 'openIdConnect'),
      typeAt('HttpNoScheme', 'http'),
      typeAt('MtlsIn30', 'mutualTLS'),
      typeAt('PaddedType', 'apiKey'),
    ]));
  });

  test('accepts oauth2 and bearer in any case and with spaces', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows chained $refs and reports once on the final definition', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      httpAt('LegacyBasicBase', 'basic'),
      typeAt('AgencyKey', 'apiKey'),
    ]));
  });

  test('ignores circular, dangling and undeclared references and follows $ref callbacks', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('skips the schemes applied only to the default excluded paths, callbacks included', async () => {
    expect(await findings(failPathFilter)).toEqual(sorted([
      typeAt('OrdersKey', 'apiKey'),
      typeAt('OrderEventsKey', 'apiKey'),
      typeAt('StatusKey', 'apiKey'),
      typeAt('V1HealthKey', 'apiKey'),
      typeAt('UnusedKey', 'apiKey'),
    ]));
    expect(await findings(failPathFilter, { paths: '' })).toHaveLength(8);
    expect(await findings(failPathFilter, { paths: '/health', pathValidationStrategy: '/include' })).toEqual(sorted([
      typeAt('HealthKey', 'apiKey'),
      typeAt('ProbeCallbackKey', 'apiKey'),
    ]));
  });

  test('root security inherited only by excluded paths, security: [] and anonymous alternatives report nothing', async () => {
    expect(await findings(okPathFilter)).toEqual([]);
    expect(await findings(okPathFilter, { paths: '' })).toEqual(sorted([
      typeAt('MonitoringKey', 'apiKey'),
      httpAt('ProbeBasic', 'basic'),
      typeAt('MeSso', 'openIdConnect'),
    ]));
  });

  test('ignores schemes without a usable type', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
    expect(await findings(okNotEvaluated, { 'allowed-security-types': 'nothing' })).toEqual([]);
  });
});

describe('apiq:OAR121 - allowed-security-types option', () => {
  test('http allows every HTTP scheme, and only them', async () => {
    expect(await findings(failExample, { 'allowed-security-types': 'http' })).toEqual(sorted([
      typeAt('PartnerOAuth', 'oauth2', 'http'),
      typeAt('TypeCase', 'OAuth2', 'http'),
      typeAt('HeaderKey', 'apiKey', 'http'),
      typeAt('CorporateSso', 'openIdConnect', 'http'),
      typeAt('MtlsIn30', 'mutualTLS', 'http'),
      typeAt('PaddedType', 'apiKey', 'http'),
    ]));
  });

  test('an HTTP scheme allows only that scheme; names are case-insensitive and echoed as written', async () => {
    const allowed = 'oauth2, BASIC, apikey';
    expect(await findings(failExample, { 'allowed-security-types': 'oauth2, BASIC, apikey' })).toEqual(sorted([
      httpAt('ServiceBearer', 'bearer', allowed),
      httpAt('CapsBearer', 'Bearer', allowed),
      httpAt('DigestAuth', 'digest', allowed),
      typeAt('CorporateSso', 'openIdConnect', allowed),
      typeAt('HttpNoScheme', 'http', allowed),
      typeAt('MtlsIn30', 'mutualTLS', allowed),
    ]));
  });

  test('an array allowing every type reports nothing', async () => {
    expect(await findings(failExample, { 'allowed-security-types': ['oauth2', 'bearer,apiKey', 'openIdConnect', 'mutualTLS', 'http'] })).toEqual([]);
  });

  test('a blank or unusable value falls back to the default list', async () => {
    const shipped = await findings(failExample);
    for (const option of ['', ' , ', 42, null, {}]) {
      expect(await findings(failExample, { 'allowed-security-types': option })).toEqual(shipped);
    }
  });
});

describe('apiq:OAR121 - OpenAPI 3.1', () => {
  test('evaluates webhooks, $ref path items, $ref with siblings, mutualTLS and unused schemes', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      httpAt('ShipmentsBasic', 'basic'),
      typeAt('CarrierCertificate', 'mutualTLS'),
      typeAt('WebhookKey', 'apiKey'),
      typeAt('OrphanSso', 'openIdConnect'),
    ]));
  });

  test('mutualTLS can be allowed and /include never evaluates webhooks or unused schemes', async () => {
    const allowed = 'oauth2, bearer, mutualTLS';
    expect(await findings(failExample31, { 'allowed-security-types': 'oauth2,bearer,mutualTLS' })).toEqual(sorted([
      httpAt('ShipmentsBasic', 'basic', allowed),
      typeAt('WebhookKey', 'apiKey', allowed),
      typeAt('OrphanSso', 'openIdConnect', allowed),
    ]));
    expect(await findings(failExample31, { paths: '/carriers', pathValidationStrategy: '/include' })).toEqual([
      typeAt('CarrierCertificate', 'mutualTLS'),
    ]);
  });

  test('accepts oauth2 and bearer next to nullable array-form types', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });
});

describe('apiq:OAR121 - OpenAPI 3.2', () => {
  test('follows query, additionalOperations, URI and $self keys and deprecated schemes', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      typeAt('DeviceKey', 'apiKey'),
      httpAt('InstallerBasic', 'basic'),
      typeAt('FirmwareCertificate', 'mutualTLS'),
      typeAt('ScenesKey', 'apiKey'),
    ]));
    expect(await findings(failExample320, { paths: '/scenes', pathValidationStrategy: '/include' })).toEqual([typeAt('ScenesKey', 'apiKey')]);
  });

  test('a scheme applied through a URI key only by an excluded path reports nothing', async () => {
    expect(await findings(okExample320)).toEqual([]);
    expect(await findings(okExample320, { paths: '' })).toEqual([typeAt('MonitoringKey', 'apiKey')]);
  });
});

describe('apq-security-types-allowed function', () => {
  test('returns nothing for a value that is not an OpenAPI document', () => {
    expect(securityTypesAllowed(null, {}, {})).toEqual([]);
    expect(securityTypesAllowed({ info: {} }, {}, {})).toEqual([]);
  });

  test('works without document inventory, raw document or rule name', () => {
    const doc = { openapi: '3.1.0', components: { securitySchemes: { Key: { type: 'apiKey', in: 'header', name: 'X' } } } };
    expect(securityTypesAllowed(doc, undefined, {})).toEqual([{
      message: "OAR121: Security scheme 'Key' type 'apiKey' is not allowed. Allowed types: oauth2, bearer.",
      path: ['components', 'securitySchemes', 'Key', 'type'],
    }]);
  });
});
