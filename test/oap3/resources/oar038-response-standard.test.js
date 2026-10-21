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
const oar038MultipleMediaTypes = require('./OAR038/multiple-media-types');
const oar038CustomDataProperty = require('./OAR038/custom-data-property');
const oar038NullableArrayType = require('./OAR038/nullable-array-type');
const oar038ErrorOnly = require('./OAR038/error-only');
const failAllowedProperties30 = require('./OAR038/fail-allowed-properties');
const failAllowedProperties31 = require('./OAR038/fail-allowed-properties-31');
const failAllowedProperties320 = require('./OAR038/fail-allowed-properties-320');
const failRequiredProperties30 = require('./OAR038/fail-required-properties');
const failRequiredProperties31 = require('./OAR038/fail-required-properties-31');
const failRequiredProperties320 = require('./OAR038/fail-required-properties-320');
const failPathFilter30 = require('./OAR038/fail-path-filter');
const failPathFilter31 = require('./OAR038/fail-path-filter-31');
const failPathFilter320 = require('./OAR038/fail-path-filter-320');
const okAllowedProperties30 = require('./OAR038/ok-allowed-properties');
const okAllowedProperties31 = require('./OAR038/ok-allowed-properties-31');
const okAllowedProperties320 = require('./OAR038/ok-allowed-properties-320');
const okRequiredProperties30 = require('./OAR038/ok-required-properties');
const okRequiredProperties31 = require('./OAR038/ok-required-properties-31');
const okRequiredProperties320 = require('./OAR038/ok-required-properties-320');
const okPathFilter30 = require('./OAR038/ok-path-filter');
const okPathFilter31 = require('./OAR038/ok-path-filter-31');
const okPathFilter320 = require('./OAR038/ok-path-filter-320');

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
    ['201 with no schema/content at all', oar038NoSchemaAtAll, 1],
    ['201 schema with empty properties object', oar038EmptyProperties, 1],
    ['oneOf branches are not merged (documented non-support)', oar038OneOfNotMerged, 1],
    ['second media type on the same 201 has an invalid property name', oar038MultipleMediaTypes, 1],
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
    ['3.1 nullable array-form type on data does not affect the check', oar038NullableArrayType],
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
const schemaAt = (path, ...rest) => [...responseAt(path), 'content', 'application/json', 'schema', ...rest];
const xmlSchemaAt = (path, ...rest) => [...responseAt(path), 'content', 'application/xml', 'schema', ...rest];
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

const VERSIONS = [
  ['OpenAPI 3.0', {
    allowed: failAllowedProperties30, required: failRequiredProperties30, paths: failPathFilter30,
    okAllowed: okAllowedProperties30, okRequired: okRequiredProperties30, okPaths: okPathFilter30,
  }],
  ['OpenAPI 3.1', {
    allowed: failAllowedProperties31, required: failRequiredProperties31, paths: failPathFilter31,
    okAllowed: okAllowedProperties31, okRequired: okRequiredProperties31, okPaths: okPathFilter31,
  }],
  ['OpenAPI 3.2', {
    allowed: failAllowedProperties320, required: failRequiredProperties320, paths: failPathFilter320,
    okAllowed: okAllowedProperties320, okRequired: okRequiredProperties320, okPaths: okPathFilter320,
  }],
];

const RDM = "'result', 'data' or 'metadata'";
const ALLOWED_DEFAULT = [
  [prop('/invoices', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
  [prop('/invoices', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [schemaAt('/payments'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
  [prop('/payouts', 'links'), NOT_ALLOWED(DEFAULT_NAMES, 'links')],
  [prop('/receipts', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [xmlSchemaAt('/disputes', 'properties', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
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
  [xmlSchemaAt('/disputes', 'properties', 'result'), NOT_ALLOWED("'data'", 'result')],
  [schemaAt('/quotes'), NO_PROPERTIES("'data'")],
];
const UPPER = "'DATA' or 'error'";
const ALLOWED_CASE_SENSITIVE = [
  [prop('/invoices', 'result'), NOT_ALLOWED(UPPER, 'result')],
  [prop('/invoices', 'data'), NOT_ALLOWED(UPPER, 'data')],
  [prop('/invoices', 'metadata'), NOT_ALLOWED(UPPER, 'metadata')],
  [prop('/credit-notes', 'data'), NOT_ALLOWED(UPPER, 'data')],
  [schemaAt('/payments'), NOT_ALLOWED(UPPER, 'result')],
  [schemaAt('/payments'), NOT_ALLOWED(UPPER, 'data')],
  [prop('/payouts', 'data'), NOT_ALLOWED(UPPER, 'data')],
  [prop('/payouts', 'links'), NOT_ALLOWED(UPPER, 'links')],
  [prop('/receipts', 'data'), NOT_ALLOWED(UPPER, 'data')],
  [prop('/receipts', 'metadata'), NOT_ALLOWED(UPPER, 'metadata')],
  [prop('/disputes', 'data'), NOT_ALLOWED(UPPER, 'data')],
  [xmlSchemaAt('/disputes', 'properties', 'result'), NOT_ALLOWED(UPPER, 'result')],
  [schemaAt('/quotes'), NO_PROPERTIES(UPPER)],
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

const ALLOWED_CASES = [
  ['not configured: data-property and error are accepted', {}, ALLOWED_DEFAULT],
  ['reported case: comma-separated string accepts result, data and metadata', { 'allowed-properties': 'result, data, metadata' }, ALLOWED_RESULT_DATA_METADATA],
  ['array form behaves like the comma-separated string', { 'allowed-properties': ['result', 'data', 'metadata'] }, ALLOWED_RESULT_DATA_METADATA],
  ['padding and empty items are ignored', { 'allowed-properties': ' result ,data,, metadata , ' }, ALLOWED_RESULT_DATA_METADATA],
  ['blank, null and non-string array entries are ignored', { 'allowed-properties': ['result', '', '  ', null, {}, 'data', 'metadata'] }, ALLOWED_RESULT_DATA_METADATA],
  ['duplicated names collapse into one', { 'allowed-properties': 'data, data, error, error' }, ALLOWED_DEFAULT],
  ['empty string falls back to the default list', { 'allowed-properties': '' }, ALLOWED_DEFAULT],
  ['whitespace-only string falls back to the default list', { 'allowed-properties': '   ' }, ALLOWED_DEFAULT],
  ['only separators falls back to the default list', { 'allowed-properties': ' , , ' }, ALLOWED_DEFAULT],
  ['empty array falls back to the default list', { 'allowed-properties': [] }, ALLOWED_DEFAULT],
  ['array of blanks falls back to the default list', { 'allowed-properties': ['', ' '] }, ALLOWED_DEFAULT],
  ['null falls back to the default list', { 'allowed-properties': null }, ALLOWED_DEFAULT],
  ['a non-string, non-array value falls back to the default list', { 'allowed-properties': 42 }, ALLOWED_DEFAULT],
  ['a single name: error is no longer accepted and a missing name is not reported', { 'allowed-properties': 'data' }, ALLOWED_DATA_ONLY],
  ['names are case-sensitive', { 'allowed-properties': 'DATA, error' }, ALLOWED_CASE_SENSITIVE],
  ['allowed-properties replaces data-property', { 'data-property': 'result', 'allowed-properties': 'data, error' }, ALLOWED_DEFAULT],
  ['data-property alone still replaces data', { 'data-property': 'result' }, DATA_PROPERTY_RESULT],
  ['blank allowed-properties keeps using data-property', { 'data-property': 'result', 'allowed-properties': '' }, DATA_PROPERTY_RESULT],
];

describe.each(VERSIONS)('apiq:OAR038 %s - allowed-properties', (_label, fixtures) => {
  test.each(ALLOWED_CASES)('%s', async (_name, functionOptions, expected) => {
    expect(await findings(fixtures.allowed, functionOptions)).toEqual(sorted(expected));
  });
});

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
  [xmlSchemaAt('/bulk-orders'), MISSING('metadata')],
  [schemaAt('/orders/{orderId}/notes'), MISSING('metadata')],
];
const REQUIRED_DATA_DEFAULT_ALLOWED = [
  [prop('/orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [schemaAt('/returns'), MISSING('data')],
  [schemaAt('/labels'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [prop('/pickups', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [responseAt('/customs-declarations'), NO_SCHEMA(DEFAULT_NAMES)],
  [schemaAt('/tracking-events'), NO_PROPERTIES(DEFAULT_NAMES)],
  [prop('/bulk-orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
];
const REQUIRED_NOT_ALLOWED = [
  [prop('/orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [schemaAt('/shipments'), MISSING('metadata')],
  [schemaAt('/returns'), MISSING('metadata')],
  [schemaAt('/labels'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [prop('/pickups', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [schemaAt('/manifests'), MISSING('metadata')],
  [responseAt('/customs-declarations'), NO_SCHEMA(DEFAULT_NAMES)],
  [schemaAt('/tracking-events'), NO_PROPERTIES(DEFAULT_NAMES)],
  [prop('/bulk-orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
  [xmlSchemaAt('/bulk-orders'), MISSING('metadata')],
  [schemaAt('/orders/{orderId}/notes'), MISSING('metadata')],
];
const REQUIRED_METADATA_ONCE = [
  [schemaAt('/shipments'), MISSING('metadata')],
  [schemaAt('/returns'), MISSING('metadata')],
  [prop('/pickups', 'metadata'), NO_SUB_PROPERTY('metadata')],
  [schemaAt('/manifests'), MISSING('metadata')],
  [responseAt('/customs-declarations'), NO_SCHEMA(ALL)],
  [schemaAt('/tracking-events'), NO_PROPERTIES(ALL)],
  [xmlSchemaAt('/bulk-orders'), MISSING('metadata')],
  [schemaAt('/orders/{orderId}/notes'), MISSING('metadata')],
];
const REQUIRED_CASE_SENSITIVE = [
  [schemaAt('/orders'), MISSING('DATA')],
  [schemaAt('/shipments'), MISSING('DATA')],
  [schemaAt('/returns'), MISSING('DATA')],
  [schemaAt('/labels'), MISSING('DATA')],
  [schemaAt('/pickups'), MISSING('DATA')],
  [prop('/pickups', 'metadata'), NO_SUB_PROPERTY('metadata')],
  [schemaAt('/manifests'), MISSING('DATA')],
  [responseAt('/customs-declarations'), NO_SCHEMA(ALL)],
  [schemaAt('/tracking-events'), NO_PROPERTIES(ALL)],
  [schemaAt('/bulk-orders'), MISSING('DATA')],
  [xmlSchemaAt('/bulk-orders'), MISSING('DATA')],
  [schemaAt('/orders/{orderId}/notes'), MISSING('DATA')],
];

const REQUIRED_CASES = [
  ['not configured: nothing is required', withAll({}), REQUIRED_NONE],
  ['empty string requires nothing', withAll({ 'required-properties': '' }), REQUIRED_NONE],
  ['only separators requires nothing', withAll({ 'required-properties': ' , ' }), REQUIRED_NONE],
  ['empty array requires nothing', withAll({ 'required-properties': [] }), REQUIRED_NONE],
  ['comma-separated string: each missing name is reported per schema and media type', withAll({ 'required-properties': 'data, metadata' }), REQUIRED_DATA_METADATA],
  ['array form behaves like the comma-separated string', withAll({ 'required-properties': ['data', 'metadata'] }), REQUIRED_DATA_METADATA],
  ['padding and empty items are ignored', withAll({ 'required-properties': ' data ,, metadata ' }), REQUIRED_DATA_METADATA],
  ['both lists as arrays', { 'allowed-properties': ['data', 'metadata', 'error'], 'required-properties': ['data', 'metadata'] }, REQUIRED_DATA_METADATA],
  ['required with the default allowed list', { 'required-properties': 'data' }, REQUIRED_DATA_DEFAULT_ALLOWED],
  ['a required name outside allowed-properties is reported as not allowed or missing', { 'required-properties': 'metadata' }, REQUIRED_NOT_ALLOWED],
  ['duplicated names are reported once', withAll({ 'required-properties': 'metadata, metadata' }), REQUIRED_METADATA_ONCE],
  ['names are case-sensitive', withAll({ 'required-properties': 'DATA' }), REQUIRED_CASE_SENSITIVE],
];

describe.each(VERSIONS)('apiq:OAR038 %s - required-properties', (_label, fixtures) => {
  test.each(REQUIRED_CASES)('%s', async (_name, functionOptions, expected) => {
    expect(await findings(fixtures.required, functionOptions)).toEqual(sorted(expected));
  });
});

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
const PDE = "'payload', 'data' or 'error'";

const PATH_CASES = [
  ['default configuration excludes exactly /me, /health, /ping and /status: /me/preferences and /health-checks are still checked', {}, [ME_PREFERENCES, ORDERS, ITEMS, ALERTS, SUBSCRIPTIONS]],
  ['the default list written explicitly behaves the same', { paths: '/me,/health,/ping,/status', pathValidationStrategy: '/exclude' }, [ME_PREFERENCES, ORDERS, ITEMS, ALERTS, SUBSCRIPTIONS]],
  ['empty paths with /exclude checks every path', { paths: '' }, EVERY_PATH],
  ['exclude is an exact match: /orders keeps /orders/{orderId}/items', { paths: '/orders' }, WITHOUT_ORDERS],
  ['/include checks only the listed paths', { paths: '/orders, /orders/{orderId}/items', pathValidationStrategy: '/include' }, [ORDERS, ITEMS]],
  ['include without the leading slash', { paths: '/orders', pathValidationStrategy: 'include' }, [ORDERS]],
  ['include in upper case', { paths: '/orders', pathValidationStrategy: 'INCLUDE' }, [ORDERS]],
  ['include with padding and mixed case', { paths: '/orders', pathValidationStrategy: ' /Include ' }, [ORDERS]],
  ['exclude without the leading slash', { paths: '/orders', pathValidationStrategy: 'exclude' }, WITHOUT_ORDERS],
  ['exclude in upper case', { paths: '/orders', pathValidationStrategy: '/EXCLUDE' }, WITHOUT_ORDERS],
  ['an unknown strategy behaves as /exclude', { paths: '/orders', pathValidationStrategy: 'skip' }, WITHOUT_ORDERS],
  ['an empty strategy behaves as /exclude', { paths: '/orders', pathValidationStrategy: '' }, WITHOUT_ORDERS],
  ['a missing strategy behaves as /exclude', { paths: '/orders', pathValidationStrategy: undefined }, WITHOUT_ORDERS],
  ['/include with empty paths checks nothing', { paths: '', pathValidationStrategy: '/include' }, []],
  ['/include with only separators checks nothing', { paths: ' , ', pathValidationStrategy: '/include' }, []],
  ['paths as an array', { paths: ['/status', '/orders'] }, [HEALTH, ME, PING, ME_PREFERENCES, ITEMS, ALERTS, SUBSCRIPTIONS]],
  ['padded path entries are trimmed', { paths: '  /alerts  ,  ' }, EVERY_PATH.filter((entry) => entry !== ALERTS)],
  ['a shared $ref response is still checked through the paths that are not excluded', { paths: '/alerts' }, EVERY_PATH.filter((entry) => entry !== ALERTS)],
  ['excluding every path that uses the shared $ref response silences it', { paths: '/alerts, /subscriptions' }, [...DEFAULT_EXCLUDED, ME_PREFERENCES, ORDERS, ITEMS]],
  ['excluding /me does not cover /me/preferences', { paths: '/me' }, EVERY_PATH.filter((entry) => entry !== ME)],
  ['/include of one path using the shared $ref response', { paths: '/alerts', pathValidationStrategy: '/include' }, [ALERTS]],
  ['a trailing slash does not match', { paths: '/orders/' }, EVERY_PATH],
  ['path matching is case-sensitive', { paths: '/ORDERS' }, EVERY_PATH],
  ['a different path parameter name does not match', { paths: '/orders/{id}/items' }, EVERY_PATH],
  ['a path without the leading slash does not match', { paths: 'orders' }, EVERY_PATH],
  [
    'path filter combined with allowed-properties and required-properties',
    { paths: '', 'allowed-properties': 'payload, data, error', 'required-properties': 'payload' },
    [
      [prop('/status', 'status'), NOT_ALLOWED(PDE, 'status')],
      [schemaAt('/status'), MISSING('payload')],
      [prop('/health', 'result'), NOT_ALLOWED(PDE, 'result')],
      [schemaAt('/health'), MISSING('payload')],
      [prop('/me', 'profile'), NOT_ALLOWED(PDE, 'profile')],
      [schemaAt('/me'), MISSING('payload')],
      [prop('/ping', 'pong'), NOT_ALLOWED(PDE, 'pong')],
      [schemaAt('/ping'), MISSING('payload')],
      [schemaAt('/health-checks'), MISSING('payload')],
    ],
  ],
  [
    '/include combined with required-properties',
    { paths: '/orders', pathValidationStrategy: '/include', 'required-properties': 'data' },
    [ORDERS, [schemaAt('/orders'), MISSING('data')]],
  ],
];

describe.each(VERSIONS)('apiq:OAR038 %s - paths and pathValidationStrategy', (_label, fixtures) => {
  test.each(PATH_CASES)('%s', async (_name, functionOptions, expected) => {
    expect(await findings(fixtures.paths, functionOptions)).toEqual(sorted(expected));
  });
});

const OK_ALLOWED_CASES = [
  ['comma-separated list', { 'allowed-properties': 'result, data, metadata' }],
  ['array form', { 'allowed-properties': ['result', 'data', 'metadata'] }],
  ['any order', { 'allowed-properties': 'metadata,result,data' }],
  ['padding and empty items', { 'allowed-properties': ' result ,, data , metadata ' }],
  ['a superset of the declared names', { 'allowed-properties': 'result, data, metadata, error' }],
  ['data-property is ignored once allowed-properties is set', { 'allowed-properties': 'result, data, metadata', 'data-property': 'payload' }],
  ['blank required-properties', { 'allowed-properties': 'result, data, metadata', 'required-properties': '' }],
];

describe.each(VERSIONS)('apiq:OAR038 %s - allowed-properties ok fixture', (_label, fixtures) => {
  test.each(OK_ALLOWED_CASES)('silent with %s', async (_name, functionOptions) => {
    expect(await findings(fixtures.okAllowed, functionOptions)).toEqual([]);
  });

  test('flagged under the default configuration, so allowed-properties is what makes it compliant', async () => {
    expect(await findings(fixtures.okAllowed, {})).toEqual(sorted([
      [prop('/invoices', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/invoices', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [schemaAt('/payments'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/payouts', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/payouts/bulk', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [xmlSchemaAt('/disputes', 'properties', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/receipts', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
    ]));
  });
});

const OK_REQUIRED_CASES = [
  ['required data and metadata', withAll({ 'required-properties': 'data, metadata' })],
  ['both lists as arrays', { 'allowed-properties': ['data', 'metadata', 'error'], 'required-properties': ['data', 'metadata'] }],
  ['required names in any order', withAll({ 'required-properties': 'metadata, data' })],
  ['only data required', withAll({ 'required-properties': 'data' })],
  ['only metadata required', withAll({ 'required-properties': 'metadata' })],
  ['padding and empty items', withAll({ 'required-properties': ' data ,, metadata ' })],
];

describe.each(VERSIONS)('apiq:OAR038 %s - required-properties ok fixture', (_label, fixtures) => {
  test.each(OK_REQUIRED_CASES)('silent with %s', async (_name, functionOptions) => {
    expect(await findings(fixtures.okRequired, functionOptions)).toEqual([]);
  });

  test('flagged under the default configuration, where metadata is not allowed', async () => {
    expect(await findings(fixtures.okRequired, {})).toEqual(sorted([
      [prop('/orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [schemaAt('/labels'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/orders/{orderId}/notes', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/bulk-orders', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [xmlSchemaAt('/bulk-orders', 'properties', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/returns', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
      [prop('/shipments', 'metadata'), NOT_ALLOWED(DEFAULT_NAMES, 'metadata')],
    ]));
  });
});

const OK_PATH_CASES = [
  ['the default configuration', {}],
  ['the default exclusion written explicitly', { paths: '/me,/health,/ping,/status', pathValidationStrategy: '/exclude' }],
  ['the excluded paths as an array in another order', { paths: ['/status', '/ping', '/health', '/me'] }],
  ['an upper-case EXCLUDE without slash and padded entries', { paths: ' /me , /health , /ping , /status ', pathValidationStrategy: 'EXCLUDE' }],
  ['/include of every compliant path', { paths: '/me/preferences, /orders, /orders/{orderId}/items, /health-checks, /alerts, /subscriptions', pathValidationStrategy: '/include' }],
  ['include of a single compliant path', { paths: '/orders', pathValidationStrategy: 'include' }],
];

describe.each(VERSIONS)('apiq:OAR038 %s - paths and pathValidationStrategy ok fixture', (_label, fixtures) => {
  test.each(OK_PATH_CASES)('silent with %s', async (_name, functionOptions) => {
    expect(await findings(fixtures.okPaths, functionOptions)).toEqual([]);
  });

  test('empty paths checks the legacy /me, /health, /ping and /status bodies', async () => {
    expect(await findings(fixtures.okPaths, { paths: '' })).toEqual(sorted([
      [prop('/status', 'status'), NOT_ALLOWED(DEFAULT_NAMES, 'status')],
      [prop('/health', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/me', 'profile'), NOT_ALLOWED(DEFAULT_NAMES, 'profile')],
      [prop('/ping', 'pong'), NOT_ALLOWED(DEFAULT_NAMES, 'pong')],
    ]));
  });

  test('excluding only /status leaves /me, /health and /ping checked', async () => {
    expect(await findings(fixtures.okPaths, { paths: '/status' })).toEqual(sorted([
      [prop('/health', 'result'), NOT_ALLOWED(DEFAULT_NAMES, 'result')],
      [prop('/me', 'profile'), NOT_ALLOWED(DEFAULT_NAMES, 'profile')],
      [prop('/ping', 'pong'), NOT_ALLOWED(DEFAULT_NAMES, 'pong')],
    ]));
  });
});
