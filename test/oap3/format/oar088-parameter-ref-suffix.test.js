const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR088/fail-example');
const okExample = require('./OAR088/ok-example');
const failRefs = require('./OAR088/fail-refs');
const okRefs = require('./OAR088/ok-refs');
const failExample31 = require('./OAR088/fail-example-31');
const okExample31 = require('./OAR088/ok-example-31');
const failExample320 = require('./OAR088/fail-example-320');
const okExample320 = require('./OAR088/ok-example-320');
const failReportedCase = require('./OAR088/fail-reported-case');
const okReportedCase = require('./OAR088/ok-reported-case');

const RULE = 'apiq:OAR088';
const SELF = 'https://api.health.example.com/appointments/openapi.yaml';
const at = (path, ref, suffix = 'Param') => [
  [...(Array.isArray(path) ? path : path.split(' ')), '$ref'],
  `OAR088: The parameter $ref '${ref}' must end with the suffix '${suffix}'.`,
];
const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const clone = (value) => JSON.parse(JSON.stringify(value));
const withVersion = (document, openapi) => ({ ...clone(document), openapi });

let linter;
const linters = new Map();
const withOptions = async (functionOptions) => {
  const key = JSON.stringify(functionOptions);
  if (!linters.has(key)) linters.set(key, await linterForRule(RULE, { functionOptions }));
  return linters.get(key);
};
const findings = async (document, functionOptions) => {
  const custom = functionOptions === undefined ? linter : await withOptions(functionOptions);
  return sorted((await custom.run(document)).filter((r) => r.code === RULE).map((r) => [r.path.map(String), r.message]));
};

const CALLBACK = ['paths', '/customers', 'post', 'callbacks', 'onboardingCompleted', '{$request.body#/callbackUrl}', 'post', 'parameters'];
const CHECKED_IN_FAIL_EXAMPLE = [
  ['paths /customers parameters 0', '#/components/parameters/tenantHeader'],
  ['paths /customers parameters 1', '#/components/parameters/correlationIdParam'],
  ['paths /customers get parameters 0', '#/components/parameters/startSlate'],
  ['paths /customers get parameters 1', '#/components/parameters/limitParam'],
  ['paths /customers get parameters 2', '#/components/parameters/totalParam'],
  ['paths /customers get parameters 3', '#/components/parameters/onboardingStatusParam'],
  ['paths /customers post parameters 0', '#/components/parameters/idempotencyKey'],
  [[...CALLBACK, '0'], '#/components/parameters/signatureHeader'],
  [[...CALLBACK, '1'], '#/components/parameters/deliveryIdParam'],
  ['paths /customers/{customerId} parameters 0', '#/components/parameters/customerId'],
  ['paths /customers/{customerId} get parameters 0', '#/components/parameters/expandParam'],
  ['paths /customers/{customerId} put parameters 0', '#/components/parameters/ifMatch'],
  ['paths /customers/{customerId} patch parameters 0', 'common.yaml#/components/parameters/ifMatchParam'],
  ['paths /customers/{customerId} delete parameters 0', 'common.yaml#/components/parameters/reason'],
  ['paths /customers/{customerId} head parameters 0', '#/components/parameters/etagParam'],
  ['paths /customers/{customerId} options parameters 0', '#/components/parameters/originParam'],
  ['paths /customers/{customerId} trace parameters 0', '#/components/parameters/traceContext'],
  ['paths /customers/{customerId}/documents get parameters 0', '#/components/parameters/documentType'],
  ['paths /customers/{customerId}/documents get parameters 1', '#/components/parameters/sessionCookie'],
  ['paths /customers/{customerId}/documents get parameters 2', './parameters/acceptLanguageParam.yaml'],
  ['components parameters pageSizeParam', '#/components/parameters/limitParam'],
  ['components parameters pageAlias', '#/components/parameters/pageSize'],
  ['components callbacks AuditEvent {$request.body#/auditUrl} post parameters 0', '#/components/parameters/auditSignature'],
];
const expectedFor = (suffix) => sorted(CHECKED_IN_FAIL_EXAMPLE
  .filter(([, ref]) => !ref.endsWith(suffix))
  .map(([path, ref]) => at(path, ref, suffix)));

const FAIL_31_FROM_PATHS = [
  at('paths /shipments get parameters 0', '#/components/parameters/shipmentStatus'),
  at('paths /labels parameters 0', '#/components/parameters/printerHeader'),
  at('paths /labels put parameters 0', '#/components/parameters/labelFormat'),
  at('components pathItems Labels get parameters 0', '#/components/parameters/labelSize'),
  at('components pathItems Shipment parameters 0', '#/components/parameters/shipmentId'),
  at('components pathItems Shipment delete parameters 0', '#/components/parameters/dispatcherHeader'),
  at('paths /carriers get parameters 0', '#/components/parameters/carrierCode'),
  at('components parameters carrierFilterParam', '#/components/parameters/carrierFilter'),
];
const FAIL_31 = [
  ...FAIL_31_FROM_PATHS,
  at('webhooks shipmentDelivered post parameters 0', '#/components/parameters/webhookSignature'),
  at('components pathItems ShipmentUpdated post parameters 0', '#/components/parameters/webhookSignature'),
  at('components pathItems Unreferenced get parameters 0', '#/components/parameters/unreferencedHeader'),
];
const CANCELLED = ['paths', '/appointments/{appointmentId}/cancel', 'post', 'callbacks', 'cancelled', '{$request.body#/callbackUrl}'];
const FAIL_320 = [
  at('paths /appointments parameters 0', '#/components/parameters/clinicHeader'),
  at('paths /appointments get parameters 0', '#/components/parameters/startSlate'),
  at('paths /appointments query parameters 0', '#/components/parameters/searchFilters'),
  at('paths /appointments additionalOperations COPY parameters 0', `${SELF}#/components/parameters/copyTarget`),
  at('x-shared-params hopParam', '#/components/parameters/hopTarget'),
  at([...CANCELLED, 'query', 'parameters', '0'], '#/components/parameters/callbackFilter'),
  at([...CANCELLED, 'additionalOperations', 'NOTIFY', 'parameters', '0'], '#/components/parameters/notifyChannel'),
  at('webhooks appointmentReminder post parameters 0', '#/components/parameters/reminderChannel'),
  at('webhooks appointmentReminder additionalOperations NOTIFY parameters 0', '#/components/parameters/reminderSignature'),
  at('components parameters aliasParam', `${SELF}#/components/parameters/alias`),
  at('components pathItems Appointment parameters 0', '#/components/parameters/appointmentId'),
  at('components pathItems Appointment query parameters 0', '#/components/parameters/includeHistory'),
];

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR088 - OpenAPI 3.0', () => {
  test('the reported case: #/components/parameters/startSlate is reported on its $ref, as a warning', async () => {
    const results = (await linter.run(failReportedCase)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 1)).toBe(true);
    expect(await findings(failReportedCase)).toEqual([at('paths /customers get parameters 0', '#/components/parameters/startSlate')]);
  });

  test('the reported case with every $ref ending in Param is compliant', async () => {
    expect(await findings(okReportedCase)).toEqual([]);
  });

  test('flags path-item, operation and callback parameters of every verb, header and cookie parameters, literal external $refs and components', async () => {
    expect(await findings(failExample)).toEqual(expectedFor('Param'));
  });

  test('ignores inline parameters, x- keys, links, schema properties named parameters, and webhooks, pathItems, query and additionalOperations', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows path item, callback, parameter list and parameter $refs, reporting each $ref once where it is written', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      at('x-path-templates Accounts get parameters 0', '#/components/parameters/accountType'),
      at('paths /statements parameters 0', '#/components/parameters/statementPeriod'),
      at('paths /statements post parameters 0', '#/components/parameters/channelHeader'),
      at('x-path-templates Statements get parameters 0', '#/components/parameters/statementFormat'),
      at(['x-path-templates', 'Reports v2', 'get', 'parameters', '0'], '#/components/parameters/reportType'),
      at('x-path-templates /files/{fileId} parameters 0', '#/components/parameters/fileId'),
      at('x-parameter-lists transfer 0', '#/components/parameters/transferMode'),
      at('x-path-templates StatusCallback post parameters 0', '#/components/parameters/statusSignature'),
      at('components callbacks TransferEvent {$request.body#/callbackUrl} post parameters 0', '#/components/parameters/eventSignature'),
      at('components parameters pageParam', '#/components/parameters/pageSize'),
      at('paths /transfers/bulk post parameters 1', '#/components/parameters/loop'),
      at('components parameters loop', '#/components/parameters/loop'),
      at('paths /transfers/bulk post parameters 2', '#/components/parameters/missing'),
      at('components parameters chainStartParam', '#/components/parameters/chainMiddle'),
      at('components parameters batch/modeParam', '#/components/parameters/batchMode'),
    ]));
  });

  test('ignores circular, dangling and external path items and callbacks, and unreferenced templates', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('webhooks and unreferenced components.pathItems are not OpenAPI 3.0, but path items reached through $ref are', async () => {
    expect(await findings(withVersion(failExample31, '3.0.3'))).toEqual(sorted(FAIL_31_FROM_PATHS));
  });

  test.each([
    ['Parameter', { 'default-suffix': 'Parameter' }, 'Parameter'],
    ['a padded value, trimmed', { 'default-suffix': ' Param ' }, 'Param'],
    ['lowercase param, compared case-sensitively', { 'default-suffix': 'param' }, 'param'],
    ['Key', { 'default-suffix': 'Key' }, 'Key'],
    ['a regex-looking value, compared literally', { 'default-suffix': '(Param|Key)$' }, '(Param|Key)$'],
  ])('default-suffix %s', async (_label, options, suffix) => {
    expect(await findings(failExample, options)).toEqual(expectedFor(suffix));
  });

  test.each([
    ['an empty string', { 'default-suffix': '' }],
    ['null', { 'default-suffix': null }],
    ['a boolean', { 'default-suffix': true }],
  ])('default-suffix falls back to Param with %s', async (_label, options) => {
    expect(await findings(failExample, options)).toEqual(expectedFor('Param'));
  });
});

describe('apiq:OAR088 - OpenAPI 3.1', () => {
  test('evaluates webhooks, every components.pathItems entry and $ref path items with siblings, ignoring Reference Object siblings', async () => {
    expect(await findings(failExample31)).toEqual(sorted(FAIL_31));
  });

  test('accepts $refs ending in Param and ignores query and additionalOperations, which are not OpenAPI 3.1 operations', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });

  test('$self is not followed and query, additionalOperations are not checked before OpenAPI 3.2', async () => {
    expect(await findings(withVersion(failExample320, '3.1.1'))).toEqual(sorted([
      at('paths /appointments parameters 0', '#/components/parameters/clinicHeader'),
      at('paths /appointments get parameters 0', '#/components/parameters/startSlate'),
      at('webhooks appointmentReminder post parameters 0', '#/components/parameters/reminderChannel'),
      at('components parameters aliasParam', `${SELF}#/components/parameters/alias`),
      at('components pathItems Appointment parameters 0', '#/components/parameters/appointmentId'),
    ]));
  });

  test('default-suffix applies to webhooks and components.pathItems too', async () => {
    const results = await findings(okExample31, { 'default-suffix': 'Parameter' });
    expect(results.length).toBeGreaterThan(10);
    expect(results.some(([path]) => path[0] === 'webhooks')).toBe(true);
    expect(results.some(([path]) => path[0] === 'components' && path[1] === 'pathItems')).toBe(true);
  });
});

describe('apiq:OAR088 - OpenAPI 3.2', () => {
  test('evaluates query, additionalOperations, callbacks and webhooks, and follows $self $refs', async () => {
    expect(await findings(failExample320)).toEqual(sorted(FAIL_320));
  });

  test('accepts $refs ending in Param, also $self and other-document URIs, querystring parameters and components.mediaTypes', async () => {
    expect(await findings(okExample320)).toEqual([]);
  });

  test('query and additionalOperations of an OpenAPI 3.1 document become operations in 3.2', async () => {
    expect(await findings(withVersion(failExample31, '3.2.0'))).toEqual(sorted([
      ...FAIL_31,
      at('paths /carriers query parameters 0', '#/components/parameters/notAnOperation'),
      at('paths /carriers additionalOperations COPY parameters 0', '#/components/parameters/notAnOperation'),
    ]));
  });

  test('default-suffix applies to query, additionalOperations and $self chains', async () => {
    expect(await findings(failExample320, { 'default-suffix': 'Target' })).toEqual(expect.arrayContaining([
      at('paths /appointments query parameters 0', '#/components/parameters/searchFilters', 'Target'),
      at('paths /appointments additionalOperations PURGE parameters 0', '#/components/parameters/purgeReasonParam', 'Target'),
      at('components parameters selfChainParam', `${SELF}#/x-shared-params/hopParam`, 'Target'),
    ]));
    expect((await findings(failExample320, { 'default-suffix': 'Target' })).some(([path]) => path.join(' ') === 'x-shared-params hopParam $ref')).toBe(false);
  });
});
