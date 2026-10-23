const { linterForRule } = require('../../helpers/utils');

let linter;
let linterCustomDataProperty;

const oar038fail = require('./OAR038/fail-example');
const oar038ok = require('./OAR038/ok-example');
const oar038NoSchemaAtAll = require('./OAR038/no-schema-at-all');
const oar038EmptyProperties = require('./OAR038/empty-properties');
const oar038AllOfComposed = require('./OAR038/allof-composed');
const oar038AllOfCircularSafe = require('./OAR038/allof-circular-safe');
const oar038OneOfNotMerged = require('./OAR038/oneof-not-merged');
const oar038CustomDataProperty = require('./OAR038/custom-data-property');
const oar038ErrorOnly = require('./OAR038/error-only');
const oar038AllowedProperties = require('./OAR038/fail-allowed-properties');
const oar038RequiredProperties = require('./OAR038/fail-required-properties');
const oar038PathFilter = require('./OAR038/fail-path-filter');
const oar038OkAllowedProperties = require('./OAR038/ok-allowed-properties');
const oar038OkRequiredProperties = require('./OAR038/ok-required-properties');
const oar038OkPathFilter = require('./OAR038/ok-path-filter');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR038');
  linterCustomDataProperty = await linterForRule('apiq:OAR038', {
    functionOptions: { 'data-property': 'result' },
  });
});

test('apiq:OAR038 should find errors', () => {
  return linter.run(oar038fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR038 should find no errors', () => {
  return linter.run(oar038ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

describe('apiq:OAR038 fail scenarios', () => {
  test.each([
    ['201 with no schema at all', oar038NoSchemaAtAll, 1],
    ['201 schema with empty properties object', oar038EmptyProperties, 1],
    ['oneOf branches are not merged (documented non-support)', oar038OneOfNotMerged, 1],
  ])('%s', (_label, document, expectedCount) => {
    return linter.run(document).then((results) => {
      expect(results.length).toBe(expectedCount);
    });
  });
});

describe('apiq:OAR038 ok scenarios', () => {
  test.each([
    ['data arrives via a single allOf branch', oar038AllOfComposed],
    ['circular allOf is safely skipped, data branch still found', oar038AllOfCircularSafe],
    ['top-level property named exactly "error" alone is valid', oar038ErrorOnly],
  ])('%s', (_label, document) => {
    return linter.run(document).then((results) => {
      expect(results.length).toBe(0);
    });
  });
});

test('apiq:OAR038 custom data-property "result": passes without "data"', () => {
  return linterCustomDataProperty.run(oar038CustomDataProperty).then((results) => {
    expect(results.length).toBe(0);
  });
});

const responseAt = (path) => ['paths', path, 'post', 'responses', '201'];
const schemaAt = (path, ...rest) => [...responseAt(path), 'schema', ...rest];
const prop = (path, name) => schemaAt(path, 'properties', name);

const DEFAULT_NAMES = "'data' or 'error'";
const NOT_ALLOWED = (names, name) => `OAR038: Response property must be named ${names}. Got '${name}'.`;
const NO_SUB_PROPERTY = (name) => `OAR038: Property '${name}' must have at least one sub-property.`;
const MISSING = (name) => `OAR038: Response schema must define the required property '${name}'.`;
const NO_PROPERTIES = (names) => `OAR038: Response schema must have properties named ${names}.`;
const NO_SCHEMA = (names) => `OAR038: 201 response must define a schema with a ${names} property.`;

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

const linters = new Map();
const findings = async (document, functionOptions) => {
  if (!linters.has(functionOptions)) {
    linters.set(functionOptions, await linterForRule('apiq:OAR038', { functionOptions }));
  }
  const results = await linters.get(functionOptions).run(document);
  return sorted(results.filter((r) => r.code === 'apiq:OAR038').map((r) => [r.path, r.message]));
};

describe('apiq:OAR038 Swagger 2.0 - allowed-properties', () => {
  const RDM = "'result', 'data' or 'metadata'";
  const ALLOWED_DEFAULT = [
    [prop('/invoices', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
    [prop('/invoices', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
    [schemaAt('/payments'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
    [prop('/payouts', 'links'), NOT_ALLOWED(DEFAULT_NAMES, 'links')],
    [prop('/receipts', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
    [prop('/disputes', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
    [schemaAt('/quotes'), NO_PROPERTIES(DEFAULT_NAMES)],
  ];
  const ALLOWED_RESULT_DATA_METADATA = [
    [prop('/refunds', 'error'), NOT_ALLOWED(RDM, 'error')],
    [prop('/payouts', 'links'), NOT_ALLOWED(RDM, 'links')],
    [prop('/receipts', 'metadata'), NO_SUB_PROPERTY('metadata')],
    [schemaAt('/quotes'), NO_PROPERTIES(RDM)],
  ];
  const ALLOWED_DATA_ONLY = [
    [prop('/invoices', 'result'), NOT_ALLOWED("'data'", 'result')],
    [prop('/invoices', 'metadata'), NOT_ALLOWED("'data'", 'metadata')],
    [prop('/refunds', 'error'), NOT_ALLOWED("'data'", 'error')],
    [schemaAt('/payments'), NOT_ALLOWED("'data'", 'result')],
    [prop('/payouts', 'links'), NOT_ALLOWED("'data'", 'links')],
    [prop('/receipts', 'metadata'), NOT_ALLOWED("'data'", 'metadata')],
    [prop('/disputes', 'result'), NOT_ALLOWED("'data'", 'result')],
    [schemaAt('/quotes'), NO_PROPERTIES("'data'")],
  ];
  const RESULT_OR_ERROR = "'result' or 'error'";
  const DATA_PROPERTY_RESULT = [
    [prop('/invoices', 'data'), NOT_ALLOWED(RESULT_OR_ERROR, 'data')],
    [prop('/invoices', 'metadata'), NOT_ALLOWED(RESULT_OR_ERROR, 'metadata')],
    [prop('/credit-notes', 'data'), NOT_ALLOWED(RESULT_OR_ERROR, 'data')],
    [schemaAt('/payments'), NOT_ALLOWED(RESULT_OR_ERROR, 'data')],
    [prop('/payouts', 'data'), NOT_ALLOWED(RESULT_OR_ERROR, 'data')],
    [prop('/payouts', 'links'), NOT_ALLOWED(RESULT_OR_ERROR, 'links')],
    [prop('/receipts', 'data'), NOT_ALLOWED(RESULT_OR_ERROR, 'data')],
    [prop('/receipts', 'metadata'), NOT_ALLOWED(RESULT_OR_ERROR, 'metadata')],
    [prop('/disputes', 'data'), NOT_ALLOWED(RESULT_OR_ERROR, 'data')],
    [schemaAt('/quotes'), NO_PROPERTIES(RESULT_OR_ERROR)],
  ];

  test.each([
    ['not configured: data-property and error are accepted', {}, ALLOWED_DEFAULT],
    ['reported case: comma-separated string accepts result, data and metadata', { 'allowed-properties': 'result, data, metadata' }, ALLOWED_RESULT_DATA_METADATA],
    ['array form behaves like the comma-separated string', { 'allowed-properties': ['result', 'data', 'metadata'] }, ALLOWED_RESULT_DATA_METADATA],
    ['padding and empty items are ignored', { 'allowed-properties': ' result ,data,, metadata , ' }, ALLOWED_RESULT_DATA_METADATA],
    ['duplicated names collapse into one', { 'allowed-properties': 'data, data, error, error' }, ALLOWED_DEFAULT],
    ['empty string falls back to the default list', { 'allowed-properties': '' }, ALLOWED_DEFAULT],
    ['only separators falls back to the default list', { 'allowed-properties': ' , , ' }, ALLOWED_DEFAULT],
    ['empty array falls back to the default list', { 'allowed-properties': [] }, ALLOWED_DEFAULT],
    ['a single name: error is no longer accepted and a missing name is not reported', { 'allowed-properties': 'data' }, ALLOWED_DATA_ONLY],
    ['allowed-properties replaces data-property', { 'data-property': 'result', 'allowed-properties': 'data, error' }, ALLOWED_DEFAULT],
    ['data-property alone still replaces data', { 'data-property': 'result' }, DATA_PROPERTY_RESULT],
  ])('%s', async (_name, functionOptions, expected) => {
    expect(await findings(oar038AllowedProperties, functionOptions)).toEqual(sorted(expected));
  });
});

describe('apiq:OAR038 Swagger 2.0 - required-properties', () => {
  const ALL = "'data', 'metadata' or 'error'";
  const withAll = (extra) => ({ 'allowed-properties': 'data, metadata, error', ...extra });
  const REQUIRED_NONE = [
    [prop('/pickups', 'metadata'), NO_SUB_PROPERTY('metadata')],
    [responseAt('/customs-declarations'), NO_SCHEMA(ALL)],
    [schemaAt('/tracking-events'), NO_PROPERTIES(ALL)],
  ];
  const REQUIRED_DATA_METADATA = [
    [schemaAt('/shipments'), MISSING('metadata')],
    [schemaAt('/returns'), MISSING('data')],
    [schemaAt('/returns'), MISSING('metadata')],
    [prop('/pickups', 'metadata'), NO_SUB_PROPERTY('metadata')],
    [schemaAt('/manifests'), MISSING('metadata')],
    [responseAt('/customs-declarations'), NO_SCHEMA(ALL)],
    [schemaAt('/tracking-events'), NO_PROPERTIES(ALL)],
    [schemaAt('/bulk-orders'), MISSING('metadata')],
    [schemaAt('/orders/{orderId}/notes'), MISSING('metadata')],
  ];

  test.each([
    ['not configured: nothing is required', withAll({}), REQUIRED_NONE],
    ['empty string requires nothing', withAll({ 'required-properties': '' }), REQUIRED_NONE],
    ['comma-separated string: a name only nested inside data does not count', withAll({ 'required-properties': 'data, metadata' }), REQUIRED_DATA_METADATA],
    ['array form behaves like the comma-separated string', withAll({ 'required-properties': ['data', 'metadata'] }), REQUIRED_DATA_METADATA],
    [
      'required with the default allowed list',
      { 'required-properties': 'data' },
      [
        [prop('/orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
        [schemaAt('/returns'), MISSING('data')],
        [schemaAt('/labels'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
        [prop('/pickups', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
        [responseAt('/customs-declarations'), NO_SCHEMA(DEFAULT_NAMES)],
        [schemaAt('/tracking-events'), NO_PROPERTIES(DEFAULT_NAMES)],
      ],
    ],
    [
      'a required name outside allowed-properties is reported as not allowed or missing',
      { 'required-properties': 'metadata' },
      [
        [prop('/orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
        [schemaAt('/shipments'), MISSING('metadata')],
        [schemaAt('/returns'), MISSING('metadata')],
        [schemaAt('/labels'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
        [prop('/pickups', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
        [schemaAt('/manifests'), MISSING('metadata')],
        [responseAt('/customs-declarations'), NO_SCHEMA(DEFAULT_NAMES)],
        [schemaAt('/tracking-events'), NO_PROPERTIES(DEFAULT_NAMES)],
        [schemaAt('/bulk-orders'), MISSING('metadata')],
        [schemaAt('/orders/{orderId}/notes'), MISSING('metadata')],
      ],
    ],
  ])('%s', async (_name, functionOptions, expected) => {
    expect(await findings(oar038RequiredProperties, functionOptions)).toEqual(sorted(expected));
  });
});

describe('apiq:OAR038 Swagger 2.0 - paths and pathValidationStrategy', () => {
  const STATUS = [prop('/status', 'status'), NOT_ALLOWED(DEFAULT_NAMES, 'status')];
  const HEALTH = [prop('/health', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')];
  const ME = [prop('/me', 'profile'), NOT_ALLOWED(DEFAULT_NAMES, 'profile')];
  const PING = [prop('/ping', 'pong'), NOT_ALLOWED(DEFAULT_NAMES, 'pong')];
  const ME_PREFERENCES = [prop('/me/preferences', 'payload'), NOT_ALLOWED(DEFAULT_NAMES, 'payload')];
  const ORDERS = [prop('/orders', 'payload'), NOT_ALLOWED(DEFAULT_NAMES, 'payload')];
  const ITEMS = [prop('/orders/{orderId}/items', 'payload'), NOT_ALLOWED(DEFAULT_NAMES, 'payload')];
  const ALERTS = [prop('/alerts', 'payload'), NOT_ALLOWED(DEFAULT_NAMES, 'payload')];
  const SUBSCRIPTIONS = [prop('/subscriptions', 'payload'), NOT_ALLOWED(DEFAULT_NAMES, 'payload')];
  const DEFAULT_EXCLUDED = [STATUS, HEALTH, ME, PING];
  const EVERY_PATH = [...DEFAULT_EXCLUDED, ME_PREFERENCES, ORDERS, ITEMS, ALERTS, SUBSCRIPTIONS];
  const WITHOUT_ORDERS = EVERY_PATH.filter((entry) => entry !== ORDERS);

  test.each([
    ['default configuration excludes exactly /me, /health, /ping and /status: /me/preferences and /health-checks are still checked', {}, [ME_PREFERENCES, ORDERS, ITEMS, ALERTS, SUBSCRIPTIONS]],
    ['empty paths with /exclude checks every path', { paths: '' }, EVERY_PATH],
    ['exclude is an exact match: /orders keeps /orders/{orderId}/items', { paths: '/orders' }, WITHOUT_ORDERS],
    ['/include checks only the listed paths', { paths: '/orders, /orders/{orderId}/items', pathValidationStrategy: '/include' }, [ORDERS, ITEMS]],
    ['include without the leading slash', { paths: '/orders', pathValidationStrategy: 'include' }, [ORDERS]],
    ['an unknown strategy behaves as /exclude', { paths: '/orders', pathValidationStrategy: 'skip' }, WITHOUT_ORDERS],
    ['/include with empty paths checks nothing', { paths: '', pathValidationStrategy: '/include' }, []],
    ['paths as an array', { paths: ['/status', '/orders'] }, [HEALTH, ME, PING, ME_PREFERENCES, ITEMS, ALERTS, SUBSCRIPTIONS]],
    ['a shared #/responses entry is still checked through the paths that are not excluded', { paths: '/alerts' }, EVERY_PATH.filter((entry) => entry !== ALERTS)],
    ['excluding every path that uses the shared #/responses entry silences it', { paths: '/alerts, /subscriptions' }, [...DEFAULT_EXCLUDED, ME_PREFERENCES, ORDERS, ITEMS]],
    ['excluding /me does not cover /me/preferences', { paths: '/me' }, EVERY_PATH.filter((entry) => entry !== ME)],
    ['a trailing slash does not match', { paths: '/orders/' }, EVERY_PATH],
    ['path matching is case-sensitive', { paths: '/ORDERS' }, EVERY_PATH],
    [
      '/include combined with allowed-properties and required-properties',
      { paths: '/status, /health-checks', pathValidationStrategy: '/include', 'allowed-properties': 'status, data', 'required-properties': 'status' },
      [
        [prop('/status', 'status'), NO_SUB_PROPERTY('status')],
        [schemaAt('/health-checks'), MISSING('status')],
      ],
    ],
  ])('%s', async (_name, functionOptions, expected) => {
    expect(await findings(oar038PathFilter, functionOptions)).toEqual(sorted(expected));
  });
});

describe('apiq:OAR038 Swagger 2.0 - allowed-properties ok fixture', () => {
  test.each([
    ['comma-separated list', { 'allowed-properties': 'result, data, metadata' }],
    ['array form', { 'allowed-properties': ['result', 'data', 'metadata'] }],
    ['any order with padding', { 'allowed-properties': ' metadata ,, result,data ' }],
    ['a superset of the declared names', { 'allowed-properties': 'result, data, metadata, error' }],
    ['data-property is ignored once allowed-properties is set', { 'allowed-properties': 'result, data, metadata', 'data-property': 'payload' }],
  ])('silent with %s', async (_name, functionOptions) => {
    expect(await findings(oar038OkAllowedProperties, functionOptions)).toEqual([]);
  });

  test('flagged under the default configuration, so allowed-properties is what makes it compliant', async () => {
    expect(await findings(oar038OkAllowedProperties, {})).toEqual(sorted([
      [prop('/invoices', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/invoices', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [schemaAt('/payments'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/payouts', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/payouts/bulk', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/disputes', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/receipts', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
    ]));
  });
});

describe('apiq:OAR038 Swagger 2.0 - required-properties ok fixture', () => {
  const withAll = (extra) => ({ 'allowed-properties': 'data, metadata, error', ...extra });

  test.each([
    ['required data and metadata', withAll({ 'required-properties': 'data, metadata' })],
    ['both lists as arrays', { 'allowed-properties': ['data', 'metadata', 'error'], 'required-properties': ['metadata', 'data'] }],
    ['only data required', withAll({ 'required-properties': 'data' })],
    ['only metadata required', withAll({ 'required-properties': 'metadata' })],
  ])('silent with %s', async (_name, functionOptions) => {
    expect(await findings(oar038OkRequiredProperties, functionOptions)).toEqual([]);
  });

  test('flagged under the default configuration, where metadata is not allowed', async () => {
    expect(await findings(oar038OkRequiredProperties, {})).toEqual(sorted([
      [prop('/orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [schemaAt('/labels'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/orders/{orderId}/notes', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/bulk-orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/returns', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/shipments', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
    ]));
  });
});

describe('apiq:OAR038 Swagger 2.0 - paths and pathValidationStrategy ok fixture', () => {
  test.each([
    ['the default configuration', {}],
    ['the default exclusion written explicitly', { paths: '/me,/health,/ping,/status', pathValidationStrategy: '/exclude' }],
    ['the excluded paths as an array in another order', { paths: ['/status', '/ping', '/health', '/me'] }],
    ['/include of every compliant path', { paths: '/me/preferences, /orders, /orders/{orderId}/items, /health-checks, /alerts, /subscriptions', pathValidationStrategy: '/include' }],
  ])('silent with %s', async (_name, functionOptions) => {
    expect(await findings(oar038OkPathFilter, functionOptions)).toEqual([]);
  });

  test('empty paths checks the legacy /me, /health, /ping and /status bodies', async () => {
    expect(await findings(oar038OkPathFilter, { paths: '' })).toEqual(sorted([
      [prop('/status', 'status'), NOT_ALLOWED(DEFAULT_NAMES, 'status')],
      [prop('/health', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/me', 'profile'), NOT_ALLOWED(DEFAULT_NAMES, 'profile')],
      [prop('/ping', 'pong'), NOT_ALLOWED(DEFAULT_NAMES, 'pong')],
    ]));
  });
});
