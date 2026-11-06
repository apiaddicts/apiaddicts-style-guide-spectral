const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR080/fail-example');
const okExample = require('./OAR080/ok-example');
const okReportedCase = require('./OAR080/ok-reported-case');
const failRefs = require('./OAR080/fail-refs');
const okRefs = require('./OAR080/ok-refs');
const failExample31 = require('./OAR080/fail-example-31');
const okExample31 = require('./OAR080/ok-example-31');
const failExample320 = require('./OAR080/fail-example-320');
const okExample320 = require('./OAR080/ok-example-320');

const RULE = 'apiq:OAR080';
const at = (path, scheme) => [
  [...path.map(String), scheme],
  `OAR080: Security scheme '${scheme}' is not defined in components.securitySchemes.`,
];

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const clone = (value) => JSON.parse(JSON.stringify(value));
const operationsOnly = (entries) => sorted(entries.filter(([path]) => path[0] !== 'security'));

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

const NO_GLOBAL_SECURITY = [
  ['without root security', undefined],
  ['with security: []', []],
  ['with only an anonymous requirement', [{}]],
  ['with an object instead of a list', { ghostKey: [] }],
  ['with requirements that are not objects', ['ghostKey', null, 3]],
];
const withRootSecurity = (document, security) => {
  const copy = clone(document);
  if (security === undefined) delete copy.security;
  else copy.security = security;
  return copy;
};

const FAIL_EXAMPLE = [
  at(['security', 2], 'gatewayToken'),
  at(['paths', '/payments/{paymentId}', 'put', 'security', 0], 'auditKey'),
  at(['paths', '/payments/{paymentId}', 'patch', 'security', 0], 'MerchantKey'),
  at(['paths', '/payments/{paymentId}', 'delete', 'security', 1], 'adminBearer'),
  at(['paths', '/payments/{paymentId}', 'head', 'security', 0], 'legacyKey'),
  at(['paths', '/payments/{paymentId}', 'trace', 'security', 0], 'undeclaredScheme'),
  at(['paths', '/payments/{paymentId}/captures', 'post', 'security', 0], '#/components/securitySchemes/merchantKey'),
  at(['paths', '/payments/{paymentId}/refunds', 'post', 'callbacks', 'refundSettled', '{$request.body#/callbackUrl}', 'post', 'security', 0], 'signatureKey'),
];
const FAIL_EXAMPLE_31 = [
  at(['paths', '/labels', 'put', 'security', 0], 'printerKey'),
  at(['components', 'pathItems', 'Labels', 'get', 'security', 0], 'printerKey'),
  at(['components', 'pathItems', 'Shipment', 'delete', 'security', 0], 'dispatcherKey'),
  at(['paths', '/carriers', 'get', 'security', 0], '#/components/securitySchemes/carrierKey'),
];
const FAIL_EXAMPLE_320 = [
  at(['security', 2], '#/components/securitySchemes/ghostRoot'),
  at(['paths', '/appointments', 'query', 'security', 0], 'searchKey'),
  at(['paths', '/appointments', 'additionalOperations', 'COPY', 'security', 0], '#/components/securitySchemes/partnerDigest'),
  at(['paths', '/appointments/{appointmentId}', 'delete', 'callbacks', 'cancelled', '{$request.body#/callbackUrl}', 'query', 'security', 0], '#/components/securitySchemes/callbackKey'),
  at(['webhooks', 'appointmentReminder', 'post', 'security', 0], 'https://api.health.example.com/appointments/openapi.yaml#/x-shared-security/Missing'),
  at(['webhooks', 'appointmentReminder', 'additionalOperations', 'NOTIFY', 'security', 0], 'reminderKey'),
];

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR080 - OpenAPI 3.0', () => {
  test('the reported case: apiKeyAuth is defined in components.securitySchemes, so the root and the operations are compliant', async () => {
    expect(await findings(okReportedCase)).toEqual([]);
  });

  test('flags every undefined name of the root security, the operations and their callbacks, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted(FAIL_EXAMPLE));
  });

  test('accepts defined names with any scopes, defined through $ref, AND combinations, anonymous alternatives, security: [] and malformed security', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('a defined scheme is valid even if the root security does not use it', async () => {
    const document = clone(okExample);
    document.security = [{ merchantKey: [] }];
    expect(await findings(document)).toEqual([]);
  });

  test('without components.securitySchemes every name used is reported, in the root and in the operations', async () => {
    const document = clone(okReportedCase);
    delete document.components.securitySchemes;
    expect(await findings(document)).toEqual(sorted([
      at(['security', 0], 'apiKeyAuth'),
      at(['paths', '/customers', 'get', 'security', 0], 'apiKeyAuth'),
      at(['paths', '/customers/{customerId}', 'get', 'security', 0], 'apiKeyAuth'),
      at(['paths', '/customers/{customerId}', 'delete', 'security', 0], 'apiKeyAuth'),
    ]));
  });

  test('follows chained local $refs, encoded pointers and $ref callbacks, reporting once where the key is written', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      at(['x-path-templates', 'Accounts', 'get', 'security', 2], 'cardKey'),
      at(['paths', '/statements', 'post', 'security', 0], 'adminBearer'),
      at(['x-path-templates', 'Statements', 'get', 'security', 0], 'legacyKey'),
      at(['x-path-templates', 'Reports v2', 'get', 'security', 0], 'reportKey'),
      at(['x-path-templates', '/files/{fileId}', 'get', 'security', 0], 'fileKey'),
      at(['x-path-templates', 'StatusCallback', 'post', 'security', 0], 'statusKey'),
      at(['components', 'callbacks', 'TransferEvent', '{$request.body#/callbackUrl}', 'post', 'security', 0], 'signatureKey'),
      at(['components', 'callbacks', 'Loop', '{$request.body#/loopUrl}', 'post', 'security', 0], 'loopKey'),
    ]));
  });

  test('ignores circular, dangling, non-local and unreferenced path items and callbacks', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('webhooks are not OpenAPI 3.0 operations', async () => {
    const document = clone(failExample31);
    document.openapi = '3.0.3';
    expect(await findings(document)).toEqual(sorted(FAIL_EXAMPLE_31));
  });

  test.each(NO_GLOBAL_SECURITY)('keeps checking the operations %s', async (_label, security) => {
    expect(await findings(withRootSecurity(failExample, security))).toEqual(operationsOnly(FAIL_EXAMPLE));
  });

  test('ignores any option, such as the allowedTypes list the back builds from the legacy expected-security-scheme param', async () => {
    const shipped = await findings(failExample);
    for (const options of [{ allowedTypes: ['auditKey', 'adminBearer'] }, { 'expected-security-scheme': 'oauth2, apiKey' }, { match: '^(apiKey|oauth2)$' }]) {
      expect(await findings(failExample, options)).toEqual(shipped);
    }
  });
});

describe('apiq:OAR080 - OpenAPI 3.1', () => {
  test('evaluates webhooks, components.pathItems and $ref path items with siblings, once per definition', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      ...FAIL_EXAMPLE_31,
      at(['webhooks', 'shipmentDelivered', 'post', 'security', 0], 'webhookSignature'),
      at(['components', 'pathItems', 'ShipmentUpdated', 'post', 'security', 0], 'webhookSignature'),
    ]));
  });

  test('accepts defined names and ignores query and additionalOperations, which are not OpenAPI 3.1 operations', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });

  test('URI keys are plain names before OpenAPI 3.2', async () => {
    const document = clone(failExample320);
    document.openapi = '3.1.0';
    expect(await findings(document)).toEqual(sorted([
      at(['security', 1], 'https://api.health.example.com/appointments/openapi.yaml#/components/securitySchemes/clinicKey'),
      at(['security', 2], '#/components/securitySchemes/ghostRoot'),
      at(['paths', '/appointments', 'get', 'security', 0], '#/components/securitySchemes/patientOAuth'),
      at(['paths', '/appointments/{appointmentId}', 'get', 'security', 0], 'https://other.example.com/openapi.yaml#/components/securitySchemes/clinicKey'),
      at(['webhooks', 'appointmentReminder', 'post', 'security', 0], 'https://api.health.example.com/appointments/openapi.yaml#/x-shared-security/Missing'),
    ]));
  });

  test.each(NO_GLOBAL_SECURITY)('keeps checking the operations %s', async (_label, security) => {
    expect(await findings(withRootSecurity(okExample31, security))).toEqual([]);
    expect(await findings(withRootSecurity(failExample31, security))).toHaveLength(6);
  });
});

describe('apiq:OAR080 - OpenAPI 3.2', () => {
  test('evaluates query, additionalOperations, callbacks and webhooks, and resolves URI keys in the document', async () => {
    expect(await findings(failExample320)).toEqual(sorted(FAIL_EXAMPLE_320));
  });

  test('accepts names, #/components/securitySchemes and $self URIs, percent-encoded pointers, pointers outside components and URIs of other documents', async () => {
    expect(await findings(okExample320)).toEqual([]);
  });

  test('a key named like a component is defined before it is read as a URI, and a URI must point to an object', async () => {
    const document = clone(okExample320);
    document.paths['/appointments'].get.security = [{ '#/components/securitySchemes/ghost': [] }, { '#/info/title': [] }];
    expect(await findings(document)).toEqual(sorted([
      at(['paths', '/appointments', 'get', 'security', 0], '#/components/securitySchemes/ghost'),
      at(['paths', '/appointments', 'get', 'security', 1], '#/info/title'),
    ]));
    document.components.securitySchemes['#/components/securitySchemes/ghost'] = { type: 'apiKey', in: 'query', name: 'ghost' };
    expect(await findings(document)).toEqual([at(['paths', '/appointments', 'get', 'security', 1], '#/info/title')]);
  });

  test.each(NO_GLOBAL_SECURITY)('keeps checking the operations %s', async (_label, security) => {
    expect(await findings(withRootSecurity(failExample320, security))).toEqual(operationsOnly(FAIL_EXAMPLE_320));
  });
});
