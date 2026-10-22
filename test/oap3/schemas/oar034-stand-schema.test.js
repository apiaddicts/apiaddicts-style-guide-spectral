const { linterForRule } = require('../../helpers/utils');

const pagedResponseCheck = require('../../../functions/apq-paged-response-check');

const oar034fail = require('./OAR034/fail-example');
const oar034ok = require('./OAR034/ok-example');
const okSingleResource = require('./OAR034/ok-single-resource-inner-arrays');
const okNotEvaluated = require('./OAR034/ok-not-evaluated');
const okNonCollectionShapes = require('./OAR034/ok-non-collection-shapes');
const okRefs = require('./OAR034/ok-refs');
const failTopLevelArray = require('./OAR034/fail-top-level-array');
const failCollectionWithoutPaging = require('./OAR034/fail-collection-without-paging');
const failPagingStructure = require('./OAR034/fail-paging-structure');
const failRefs = require('./OAR034/fail-refs');
const failExample31 = require('./OAR034/fail-example-31');
const okExample31 = require('./OAR034/ok-example-31');
const failExample320 = require('./OAR034/fail-example-320');
const okExample320 = require('./OAR034/ok-example-320');
const failNestedPaging = require('./OAR034/fail-nested-paging');
const okNestedPaging = require('./OAR034/ok-nested-paging');
const failNestedPaging31 = require('./OAR034/fail-nested-paging-31');
const okNestedPaging31 = require('./OAR034/ok-nested-paging-31');
const failNestedPaging320 = require('./OAR034/fail-nested-paging-320');
const okNestedPaging320 = require('./OAR034/ok-nested-paging-320');

const link = { type: 'object', properties: { href: { type: 'string' } } };
const paging = () => ({
  type: 'object',
  required: ['start', 'limit', 'links'],
  properties: {
    start: { type: 'integer' },
    limit: { type: 'integer' },
    total: { type: 'integer' },
    numPages: { type: 'integer' },
    links: {
      type: 'object',
      required: ['self', 'previous', 'next'],
      properties: {
        self: link, first: link, previous: link, next: link, last: link,
      },
    },
  },
});

const RESPONSE_SCHEMA = ['content', 'application/json', 'schema'];
const at = (path, code, ...rest) => ['paths', path, 'get', 'responses', code, ...RESPONSE_SCHEMA, ...rest];
const NO_PAGING = (prop) => `OAR034: Response with collection property '${prop}' must include 'paging' property for pagination`;
const TOP_LEVEL_ARRAY = "OAR034: Collection response must be an object with a 'paging' property, not a top-level array";
const NESTED_NO_PAGING = (prop) => `OAR034: Response with collection property '${prop}' must include 'result.pagination' property for pagination`;
const NESTED_TOP_LEVEL_ARRAY = "OAR034: Collection response must be an object with a 'result.pagination' property, not a top-level array";
const RESULT_ARRAY = "OAR034: 'result' must be an object with a 'pagination' property, not an array";
const pagingOption = (pagingPropertyName) => JSON.stringify({ ...paging(), pagingPropertyName });

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

let linter;

const findings = async (document, custom = linter) => sorted((await custom.run(document))
  .filter((r) => r.code === 'apiq:OAR034')
  .map((r) => [r.path, r.message]));

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR034');
  return linter;
});

test('apiq:OAR034 should find errors', () => {
  return linter.run(oar034fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR034 should find no errors', () => {
  return linter.run(oar034ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

describe('apiq:OAR034 OpenAPI 3.0 — collection detection', () => {
  test('the documented non-compliant 206 collection is reported with a precise message', async () => {
    expect(await findings(oar034fail)).toEqual([[at('/endpoint', '206'), NO_PAGING('items')]]);
  });

  test('a single resource with inner arrays is not a collection', async () => {
    expect(await findings(okSingleResource)).toEqual([]);
  });

  test('error, default, 204, 304, non-GET, callback and detail responses are never evaluated', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });

  test('nested collections, non-collection arrays, scalars, unions and empty schemas report nothing', async () => {
    expect(await findings(okNonCollectionShapes)).toEqual([]);
  });

  test('a top-level array is a collection, typed, untyped with items, $ref-ed or nullable', async () => {
    expect(await findings(failTopLevelArray)).toEqual(sorted([
      [at('/brokers', '200'), TOP_LEVEL_ARRAY],
      [at('/agencies', '200'), TOP_LEVEL_ARRAY],
      [at('/regions', '200'), TOP_LEVEL_ARRAY],
      [at('/branches', '200'), TOP_LEVEL_ARRAY],
    ]));
  });

  test('every collection property name, case-insensitive, in 200, 206 and 2XX, per media type', async () => {
    expect(await findings(failCollectionWithoutPaging)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING('data')],
      [at('/claims', '200'), NO_PAGING('items')],
      [at('/customers', '200'), NO_PAGING('results')],
      [at('/quotes', '200'), NO_PAGING('content')],
      [at('/renewals', '200'), NO_PAGING('elements')],
      [at('/invoices', '200'), NO_PAGING('records')],
      [at('/payments', '200'), NO_PAGING('entries')],
      [at('/vehicles', '200'), NO_PAGING('values')],
      [at('/drivers', '200'), NO_PAGING('list')],
      [at('/workshops', '200'), NO_PAGING('rows')],
      [at('/repairs', '200'), NO_PAGING('payload')],
      [at('/estimates', '200'), NO_PAGING('Items')],
      [at('/appraisals', '200'), NO_PAGING('DATA')],
      [at('/endorsements', '2XX'), NO_PAGING('data')],
      [at('/tariffs', '206'), NO_PAGING('data')],
      [at('/policies/{policyId}/claims', '200'), NO_PAGING('data')],
      [at('/documents', '200'), NO_PAGING('data')],
      [at('/branches', '200'), NO_PAGING('data')],
      [at('/coverages', '200'), NO_PAGING('data')],
      [at('/invoices-export', '200'), NO_PAGING('records')],
      [['paths', '/invoices-export', 'get', 'responses', '200', 'content', 'application/xml', 'schema'], NO_PAGING('records')],
    ]));
  });
});

describe('apiq:OAR034 OpenAPI 3.0 — paging block structure', () => {
  test('required properties, required lists, types and the nested links object are validated', async () => {
    const paged = (path, ...rest) => at(path, '200', 'properties', 'paging', ...rest);
    expect(await findings(failPagingStructure)).toEqual(sorted([
      [paged('/missing-start', 'properties'), "OAR034: 'paging' must include required properties: start"],
      [paged('/missing-all', 'properties'), "OAR034: 'paging' must include required properties: start, limit, links"],
      [paged('/no-properties'), "OAR034: 'paging' must include required properties: start, limit, links"],
      [paged('/empty-paging'), "OAR034: 'paging' must include required properties: start, limit, links"],
      [paged('/not-listed'), "OAR034: 'paging' must list as required: start, limit, links"],
      [paged('/partially-listed', 'required'), "OAR034: 'paging' must list as required: limit, links"],
      [paged('/start-string', 'properties', 'start', 'type'), "OAR034: 'paging.start' must be of type integer"],
      [paged('/total-number', 'properties', 'total', 'type'), "OAR034: 'paging.total' must be of type integer"],
      [paged('/paging-array', 'type'), "OAR034: 'paging' must be of type object"],
      [paged('/paging-string', 'type'), "OAR034: 'paging' must be of type object"],
      [paged('/links-string', 'properties', 'links', 'type'), "OAR034: 'paging.links' must be of type object"],
      [paged('/links-self-only', 'properties', 'links', 'properties'), "OAR034: 'paging.links' must include required properties: previous, next"],
      [paged('/links-not-listed', 'properties', 'links', 'required'), "OAR034: 'paging.links' must list as required: previous, next"],
      [paged('/href-integer', 'properties', 'links', 'properties', 'next', 'properties', 'href', 'type'), "OAR034: 'paging.links.next.href' must be of type string"],
      [paged('/link-not-object', 'properties', 'links', 'properties', 'self', 'type'), "OAR034: 'paging.links.self' must be of type object"],
      [paged('/paging-all-of', 'allOf', '1', 'properties', 'links', 'properties'), "OAR034: 'paging.links' must include required properties: next"],
      [at('/brokers/{brokerId}', '200', 'properties', 'paging', 'properties'), "OAR034: 'paging' must include required properties: limit, links"],
      [at('/detail-with-bad-paging/{id}', '200', 'properties', 'paging', 'type'), "OAR034: 'paging' must be of type object"],
    ]));
  });
});

describe('apiq:OAR034 OpenAPI 3.0 — $ref resolution', () => {
  test('component responses, aliases, allOf envelopes and shared paging blocks are followed', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING('data')],
      [['paths', '/regions', 'get', 'responses', '206', ...RESPONSE_SCHEMA], NO_PAGING('data')],
      [at('/payments', '200', 'allOf', '0', 'properties', 'paging', 'required'), "OAR034: 'paging' must list as required: limit"],
      [at('/claims', '200', 'properties', 'paging', 'properties'), "OAR034: 'paging' must include required properties: start"],
      [at('/claims-again', '200', 'properties', 'paging', 'properties'), "OAR034: 'paging' must include required properties: start"],
    ]));
  });

  test('compliant paging through refs, allOf, nullable wrappers and recursive schemas reports nothing', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });
});

describe('apiq:OAR034 OpenAPI 3.1', () => {
  test('nullable array-form types and null branches are unwrapped for detection and validation', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING('data')],
      [at('/brokers', '200'), TOP_LEVEL_ARRAY],
      [at('/null-first', '200'), TOP_LEVEL_ARRAY],
      [at('/claims', '200', 'anyOf', '0'), NO_PAGING('items')],
      [at('/workshops', '200'), NO_PAGING('data')],
      [at('/vehicles', '200'), NO_PAGING('results')],
      [at('/customers', '200', 'properties', 'paging'), "OAR034: 'paging' must list as required: start, limit, links"],
      [at('/quotes', '200', 'properties', 'paging', 'properties', 'start', 'type'), "OAR034: 'paging.start' must be of type integer"],
      [at('/renewals', '200', 'properties', 'paging', 'type'), "OAR034: 'paging' must be of type object"],
      [at('/repairs', '200', 'properties', 'paging', 'oneOf', '0', 'properties'), "OAR034: 'paging' must include required properties: start"],
      [at('/drivers', '200', 'properties', 'paging', 'properties', 'total', 'type'), "OAR034: 'paging.total' must be of type integer"],
      [at('/drivers', '200', 'properties', 'paging', 'properties', 'links', 'required'), "OAR034: 'paging.links' must list as required: next"],
      [at('/archived-policies', '200'), NO_PAGING('rows')],
      [at('/fleets', '200'), NO_PAGING('list')],
    ]));
  });

  test('compliant 3.1 paging with nullable forms, $ref siblings, pathItems and $defs reports nothing', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });
});

describe('apiq:OAR034 OpenAPI 3.2', () => {
  test('components.mediaTypes, response summaries and a JSON schema next to an itemSchema are evaluated', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      [at('/claims', '200'), NO_PAGING('data')],
      [at('/losses', '200'), NO_PAGING('items')],
      [at('/contractors', '200'), NO_PAGING('results')],
      [at('/settlements', '2XX'), NO_PAGING('values')],
      [at('/appointments', '200', 'properties', 'paging', 'properties', 'limit', 'type'), "OAR034: 'paging.limit' must be of type integer"],
      [at('/appointments', '200', 'properties', 'paging', 'properties', 'links', 'required'), "OAR034: 'paging.links' must list as required: previous"],
    ]));
  });

  test('itemSchema streams, QUERY, additionalOperations and webhooks are not evaluated', async () => {
    expect(await findings(okExample320)).toEqual([]);
  });
});

describe('apiq:OAR034 paging-schema option', () => {
  const custom = (pagingSchema) => linterForRule('apiq:OAR034', { functionOptions: { 'paging-schema': pagingSchema } });

  test('a custom property name and required list replace the defaults', async () => {
    const cursor = JSON.stringify({ pagingPropertyName: 'pagination', required: ['cursor'], properties: { cursor: { type: 'string' } } });
    const document = {
      openapi: '3.0.3',
      info: { title: 'Cursor API', version: '1.0.0' },
      paths: {
        '/ok': { get: { responses: { 200: { description: 'Ok', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array' }, pagination: { type: 'object', required: ['cursor'], properties: { cursor: { type: 'string' } } } } } } } } } } },
        '/missing': { get: { responses: { 200: { description: 'Ok', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array' }, paging: paging() } } } } } } } },
        '/wrong-type': { get: { responses: { 200: { description: 'Ok', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array' }, pagination: { type: 'object', required: ['cursor'], properties: { cursor: { type: 'integer' } } } } } } } } } } },
      },
    };
    expect(await findings(document, await custom(cursor))).toEqual(sorted([
      [at('/missing', '200'), "OAR034: Response with collection property 'data' must include 'pagination' property for pagination"],
      [at('/wrong-type', '200', 'properties', 'pagination', 'properties', 'cursor', 'type'), "OAR034: 'pagination.cursor' must be of type string"],
    ]));
  });

  test('the links required list comes from the option instead of being fixed', async () => {
    const relaxed = JSON.parse(JSON.stringify(paging()));
    relaxed.properties.links.required = ['self'];
    const document = {
      openapi: '3.0.3',
      info: { title: 'Links API', version: '1.0.0' },
      paths: { '/items': { get: { responses: { 200: { description: 'Ok', content: { 'application/json': { schema: { type: 'object', properties: { items: { type: 'array' }, paging: { ...paging(), properties: { ...paging().properties, links: { type: 'object', required: ['self'], properties: { self: {} } } } } } } } } } } } } },
    };
    expect(await findings(document)).toEqual([[at('/items', '200', 'properties', 'paging', 'properties', 'links', 'properties'), "OAR034: 'paging.links' must include required properties: previous, next"]]);
    expect(await findings(document, await custom(JSON.stringify(relaxed)))).toEqual([]);
  });

  test.each([
    ['invalid JSON', '{"type":'],
    ['an empty string', ''],
    ['JSON null', 'null'],
    ['a JSON array', '[]'],
    ['a number', 42],
  ])('%s falls back to the standard paging schema', async (_, value) => {
    expect(await findings(oar034fail, await custom(value))).toEqual([[at('/endpoint', '206'), NO_PAGING('items')]]);
    expect(await findings(oar034ok, await custom(value))).toEqual([]);
  });
});

describe('apiq:OAR034 reported case — root and result pagination', () => {
  const json = (schema) => ({ description: 'Ok', content: { 'application/json': { schema } } });
  const usersApi = (collection, single) => ({
    openapi: '3.0.3',
    info: { title: 'Users API', version: '1.0.0' },
    paths: {
      '/users': { get: { parameters: [{ name: '$start', in: 'query', schema: { type: 'integer' } }], responses: { 200: json(collection) } } },
      '/users/me': { get: { responses: { 200: json(single) } } },
      '/users/{path_id}': { get: { parameters: [{ name: 'path_id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: json(single) } } },
    },
  });
  const user = { type: 'object', properties: { id: { type: 'string' }, roles: { type: 'array', items: { type: 'string' } } } };
  const users = { type: 'array', items: user };
  let rootLinter;
  let resultLinter;

  beforeAll(async () => {
    rootLinter = await linterForRule('apiq:OAR034', { functionOptions: { 'paging-schema': pagingOption('pagination') } });
    resultLinter = await linterForRule('apiq:OAR034', { functionOptions: { 'paging-schema': pagingOption('result.pagination') } });
  });

  test('root pagination: an empty {"pagination":{}} block is reported only on the /users collection', async () => {
    const document = usersApi({ type: 'object', properties: { data: users, pagination: {} } }, { type: 'object', properties: { data: user } });
    expect(await findings(document, rootLinter)).toEqual([
      [at('/users', '200', 'properties', 'pagination'), "OAR034: 'pagination' must include required properties: start, limit, links"],
    ]);
    expect(await findings(usersApi({ type: 'object', properties: { data: users, pagination: paging() } }, { type: 'object', properties: { data: user } }), rootLinter)).toEqual([]);
  });

  test('result pagination: an empty {"result":{"pagination":{}}} block is reported only on the /users collection', async () => {
    const single = { type: 'object', properties: { result: { type: 'object', properties: { data: user } } } };
    const document = usersApi({ type: 'object', properties: { result: { type: 'object', properties: { data: users, pagination: {} } } } }, single);
    expect(await findings(document, resultLinter)).toEqual([
      [at('/users', '200', 'properties', 'result', 'properties', 'pagination'), "OAR034: 'result.pagination' must include required properties: start, limit, links"],
    ]);
    expect(await findings(usersApi({ type: 'object', properties: { result: { type: 'object', properties: { data: users, pagination: paging() } } } }, single), resultLinter)).toEqual([]);
  });

  test('/users/{path_id} is never asked for paging, while a collection returned by /users/me still is', async () => {
    const collection = { type: 'object', properties: { result: { type: 'object', properties: { data: users } } } };
    expect(await findings(usersApi(collection, collection), resultLinter)).toEqual(sorted([
      [at('/users', '200', 'properties', 'result'), NESTED_NO_PAGING('result.data')],
      [at('/users/me', '200', 'properties', 'result'), NESTED_NO_PAGING('result.data')],
    ]));
  });

  test('each placement is only looked for where the option points', async () => {
    const rootPaged = usersApi({ type: 'object', properties: { data: users, pagination: paging() } }, { type: 'object', properties: { data: user } });
    const resultPaged = usersApi({ type: 'object', properties: { result: { type: 'object', properties: { data: users, pagination: {} } } } }, { type: 'object', properties: { data: user } });
    expect(await findings(rootPaged, resultLinter)).toEqual([[at('/users', '200'), NESTED_NO_PAGING('data')]]);
    expect(await findings(resultPaged, rootLinter)).toEqual([]);
  });
});

describe('apiq:OAR034 nested paging path (result.pagination)', () => {
  let nested;

  beforeAll(async () => {
    nested = await linterForRule('apiq:OAR034', { functionOptions: { 'paging-schema': pagingOption('result.pagination') } });
  });

  test('OpenAPI 3.0: envelopes, sub-collections, array results, allOf, aliases, nullable and per media type', async () => {
    expect(await findings(failNestedPaging, nested)).toEqual(sorted([
      [at('/audit-events', '200'), NESTED_NO_PAGING('data')],
      [at('/devices', '200'), NESTED_TOP_LEVEL_ARRAY],
      [at('/groups', '200', 'properties', 'result', 'properties', 'pagination'), "OAR034: 'result.pagination' must include required properties: start, limit, links"],
      [['paths', '/locales', 'get', 'responses', '200', 'content', 'application/xml', 'schema', 'properties', 'result'], NESTED_NO_PAGING('result.records')],
      [at('/notifications', '200', 'properties', 'result'), NESTED_NO_PAGING('result.data')],
      [at('/organizations', '200', 'allOf', '0', 'properties', 'result', 'allOf', '0', 'properties', 'pagination'), "OAR034: 'result.pagination' must list as required: start, limit, links"],
      [at('/permissions', '206', 'properties', 'result', 'properties', 'pagination', 'properties', 'start', 'type'), "OAR034: 'result.pagination.start' must be of type integer"],
      [at('/roles', '200', 'properties', 'result', 'type'), RESULT_ARRAY],
      [at('/settings/{settingId}', '200', 'properties', 'result', 'properties', 'pagination', 'type'), "OAR034: 'result.pagination' must be of type object"],
      [at('/teams', '2XX', 'properties', 'result', 'properties', 'pagination', 'properties', 'links', 'properties'), "OAR034: 'result.pagination.links' must include required properties: previous, next"],
      [at('/users/{userId}/sessions', '200', 'properties', 'result'), NESTED_NO_PAGING('result.data')],
    ]));
  });

  test('OpenAPI 3.0: the compliant directory, /users/me and detail endpoints report nothing', async () => {
    expect(await findings(okNestedPaging, nested)).toEqual([]);
  });

  test('OpenAPI 3.1: nullable array-form types, null branches, pathItems and $defs are followed', async () => {
    expect(await findings(failNestedPaging31, nested)).toEqual(sorted([
      [at('/archived-users', '200', 'properties', 'result'), NESTED_NO_PAGING('result.rows')],
      [at('/devices', '200'), NESTED_TOP_LEVEL_ARRAY],
      [at('/fleets', '200', 'properties', 'result'), NESTED_NO_PAGING('result.list')],
      [at('/groups', '200', 'properties', 'result'), NESTED_NO_PAGING('result.data')],
      [at('/invitations', '200', 'properties', 'result', 'properties', 'pagination', 'oneOf', '1', 'properties'), "OAR034: 'result.pagination' must include required properties: start"],
      [at('/memberships', '200', 'properties', 'result', 'properties', 'pagination', 'properties', 'start', 'type'), "OAR034: 'result.pagination.start' must be of type integer"],
      [at('/roles', '200', 'properties', 'result', 'type'), RESULT_ARRAY],
      [at('/teams', '200', 'properties', 'result', 'anyOf', '0', 'properties', 'pagination', 'properties'), "OAR034: 'result.pagination' must include required properties: links"],
    ]));
  });

  test('OpenAPI 3.1: compliant nullable envelopes, webhooks and a null result report nothing', async () => {
    expect(await findings(okNestedPaging31, nested)).toEqual([]);
  });

  test('OpenAPI 3.2: components.mediaTypes, itemSchema streams, QUERY and additionalOperations', async () => {
    const settings = (...rest) => at('/settings', '2XX', 'properties', 'result', 'properties', 'pagination', ...rest);
    expect(await findings(failNestedPaging320, nested)).toEqual(sorted([
      [at('/audit-events', '200', 'properties', 'result'), NESTED_NO_PAGING('result.entries')],
      [at('/devices', '200', 'properties', 'result', 'type'), RESULT_ARRAY],
      [at('/groups', '200', 'properties', 'result'), NESTED_NO_PAGING('result.results')],
      [settings('properties', 'limit', 'type'), "OAR034: 'result.pagination.limit' must be of type integer"],
      [settings('properties', 'links', 'required'), "OAR034: 'result.pagination.links' must list as required: previous"],
      [settings('required'), "OAR034: 'result.pagination' must list as required: limit"],
    ]));
  });

  test('OpenAPI 3.2: the compliant directory reports nothing', async () => {
    expect(await findings(okNestedPaging320, nested)).toEqual([]);
  });

  test('the shipped option keeps looking only at the root, so result envelopes are not evaluated', async () => {
    expect(await findings(failNestedPaging)).toEqual(sorted([
      [at('/audit-events', '200'), NO_PAGING('data')],
      [at('/devices', '200'), TOP_LEVEL_ARRAY],
    ]));
    expect(await findings(failNestedPaging31)).toEqual([[at('/devices', '200'), TOP_LEVEL_ARRAY]]);
    expect(await findings(failNestedPaging320)).toEqual([]);
  });
});

describe('apq-paged-response-check function', () => {
  const context = (path, extra = {}) => ({ path, rule: { name: 'apiq:OAR034' }, document: { data: { openapi: '3.1.0' } }, ...extra });
  const response = (schema) => ({ description: 'Ok', content: { 'application/json': { schema } } });
  const collectionPath = ['paths', '/items', 'get', 'responses', '200'];

  test('non-object responses and non-success codes produce nothing', () => {
    expect(pagedResponseCheck(null, {}, context(collectionPath))).toEqual([]);
    expect(pagedResponseCheck('Ok', {}, context(collectionPath))).toEqual([]);
    const collection = response({ type: 'array' });
    expect(pagedResponseCheck(collection, {}, context(['paths', '/items', 'get', 'responses', '204']))).toEqual([]);
    expect(pagedResponseCheck(collection, {}, context(['paths', '/items', 'get', 'responses', '404']))).toEqual([]);
    expect(pagedResponseCheck(collection, {}, context(['paths', '/items', 'get', 'responses', 'default']))).toEqual([]);
    expect(pagedResponseCheck(collection, {}, context(['paths', '/items', 'get', 'responses', '2xx']))).toHaveLength(1);
  });

  test('the rule code falls back to OAR034 without a rule name and options may be absent', () => {
    expect(pagedResponseCheck(response({ type: 'array' }), undefined, { path: collectionPath, document: { data: {} } })).toEqual([
      { message: TOP_LEVEL_ARRAY, path: [...collectionPath, ...RESPONSE_SCHEMA] },
    ]);
    expect(pagedResponseCheck(response({ type: 'array' }), null, context(collectionPath))).toHaveLength(1);
  });

  test('the option can be passed as an object and the property name is trimmed', () => {
    const template = { pagingPropertyName: ' meta ', required: ['cursor'] };
    const schema = { type: 'object', properties: { data: { type: 'array' }, meta: { type: 'object', properties: { next: {} } } } };
    expect(pagedResponseCheck(response(schema), { 'paging-schema': template }, context(collectionPath))).toEqual([
      { message: "OAR034: 'meta' must include required properties: cursor", path: [...collectionPath, ...RESPONSE_SCHEMA, 'properties', 'meta', 'properties'] },
    ]);
  });

  test('self-referencing allOf and oneOf chains terminate', () => {
    const cyclicAllOf = { type: 'object', properties: { data: { type: 'array' } } };
    cyclicAllOf.allOf = [cyclicAllOf];
    const cyclicOneOf = { oneOf: [{ type: 'null' }] };
    cyclicOneOf.oneOf.push(cyclicOneOf);
    expect(pagedResponseCheck(response(cyclicAllOf), {}, context(collectionPath))).toHaveLength(1);
    expect(pagedResponseCheck(response(cyclicOneOf), {}, context(collectionPath))).toEqual([]);
  });

  test('templates with non-object children, typeless leaves and array items without an actual items schema are tolerated', () => {
    const template = JSON.stringify({
      required: ['start', 7, null],
      properties: {
        start: 'integer', total: { type: 'number' }, limit: {}, links: { type: 'array', items: { required: ['href'] } },
      },
    });
    const schema = {
      type: 'object',
      properties: {
        data: { type: 'array' },
        paging: {
          type: 'object',
          required: ['start'],
          properties: {
            start: { type: 'string' }, total: { type: 'integer' }, limit: { description: 'untyped' }, links: { type: 'array' },
          },
        },
      },
    };
    expect(pagedResponseCheck(response(schema), { 'paging-schema': template }, context(collectionPath))).toEqual([]);
  });

  test('an array template validates every item of a HAL style links array', () => {
    const template = JSON.stringify({
      required: ['links'],
      properties: { links: { type: 'array', items: { type: 'object', required: ['rel', 'href'], properties: { href: { type: 'string' } } } } },
    });
    const schema = {
      type: 'object',
      properties: {
        data: { type: 'array' },
        paging: {
          type: 'object',
          required: ['links'],
          properties: { links: { type: ['array', 'null'], items: { type: 'object', required: ['rel'], properties: { rel: { type: 'string' }, href: { type: 'integer' } } } } },
        },
      },
    };
    const linksPath = [...collectionPath, ...RESPONSE_SCHEMA, 'properties', 'paging', 'properties', 'links', 'items'];
    expect(pagedResponseCheck(response(schema), { 'paging-schema': template }, context(collectionPath))).toEqual([
      { message: "OAR034: 'paging.links[]' must list as required: href", path: [...linksPath, 'required'] },
      { message: "OAR034: 'paging.links[].href' must be of type string", path: [...linksPath, 'properties', 'href', 'type'] },
    ]);
  });

  test('Swagger 2.0 documents read the response schema directly', () => {
    const swagger = { path: collectionPath, rule: { name: 'apiq:OAR034' }, document: { data: { swagger: '2.0' } } };
    expect(pagedResponseCheck({ description: 'Ok', schema: { type: 'array' } }, {}, swagger)).toEqual([
      { message: TOP_LEVEL_ARRAY, path: [...collectionPath, 'schema'] },
    ]);
    expect(pagedResponseCheck(response({ type: 'array' }), {}, swagger)).toEqual([]);
  });

  describe('dotted pagingPropertyName', () => {
    const schemaPath = [...collectionPath, ...RESPONSE_SCHEMA];
    const option = (pagingPropertyName) => ({ 'paging-schema': { required: ['start'], pagingPropertyName } });
    const wrapped = { type: 'object', properties: { result: { type: 'object', properties: { data: { type: 'array' }, pagination: { type: 'object', properties: {} } } } } };
    const missingStart = (label, ...rest) => ({ message: `OAR034: '${label}' must include required properties: start`, path: [...schemaPath, ...rest] });

    test.each([
      ['result.pagination'],
      [' result . pagination '],
      ['result..pagination'],
      ['.result.pagination.'],
    ])('%j resolves the paging block inside the result envelope', (name) => {
      expect(pagedResponseCheck(response(wrapped), option(name), context(collectionPath))).toEqual([
        missingStart('result.pagination', 'properties', 'result', 'properties', 'pagination', 'properties'),
      ]);
    });

    test.each([['.'], ['..'], [' . ']])('%j has no segment and falls back to paging', (name) => {
      expect(pagedResponseCheck(response(wrapped), option(name), context(collectionPath))).toEqual([]);
      const rootPaging = { type: 'object', properties: { data: { type: 'array' }, paging: { type: 'object' } } };
      expect(pagedResponseCheck(response(rootPaging), option(name), context(collectionPath))).toEqual([
        missingStart('paging', 'properties', 'paging'),
      ]);
    });

    test('a property literally named with the dotted name wins over the nested path', () => {
      const literal = { type: 'object', properties: { data: { type: 'array' }, 'meta.paging': { type: 'object', properties: {} }, meta: { type: 'object', properties: { paging: { type: 'object', required: ['start'], properties: { start: { type: 'integer' } } } } } } };
      expect(pagedResponseCheck(response(literal), option('meta.paging'), context(collectionPath))).toEqual([
        missingStart('meta.paging', 'properties', 'meta.paging', 'properties'),
      ]);
    });

    test('a three level path walks envelope after envelope and prefixes the collection it finds', () => {
      const deep = (inner) => ({ type: 'object', properties: { response: { type: 'object', properties: { result: { type: 'object', properties: inner } } } } });
      const name = option('response.result.pagination');
      expect(pagedResponseCheck(response(deep({ items: { type: 'array' } })), name, context(collectionPath))).toEqual([
        { message: "OAR034: Response with collection property 'response.result.items' must include 'response.result.pagination' property for pagination", path: [...schemaPath, 'properties', 'response', 'properties', 'result'] },
      ]);
      expect(pagedResponseCheck(response(deep({ items: { type: 'array' }, pagination: {} })), name, context(collectionPath))).toEqual([
        missingStart('response.result.pagination', 'properties', 'response', 'properties', 'result', 'properties', 'pagination'),
      ]);
      const middleArray = { type: 'object', properties: { response: { type: 'object', properties: { result: { type: ['array', 'null'], items: {} } } } } };
      expect(pagedResponseCheck(response(middleArray), name, context(collectionPath))).toEqual([
        { message: "OAR034: 'response.result' must be an object with a 'pagination' property, not an array", path: [...schemaPath, 'properties', 'response', 'properties', 'result', 'type'] },
      ]);
    });

    test('the root is searched before the envelope, and a missing or scalar envelope only checks the root', () => {
      const name = option('result.pagination');
      const both = { type: 'object', properties: { data: { type: 'array' }, result: { type: 'object', properties: { items: { type: 'array' } } } } };
      expect(pagedResponseCheck(response(both), name, context(collectionPath))).toEqual([
        { message: "OAR034: Response with collection property 'data' must include 'result.pagination' property for pagination", path: schemaPath },
      ]);
      expect(pagedResponseCheck(response({ type: 'object', properties: { result: { type: 'string' } } }), name, context(collectionPath))).toEqual([]);
      expect(pagedResponseCheck(response({ type: 'object', properties: { meta: { type: 'object' } } }), name, context(collectionPath))).toEqual([]);
    });

    test('an envelope under an allOf member or a nullable oneOf is merged before looking for the paging block', () => {
      const name = option('result.pagination');
      const composed = { allOf: [{ type: 'object', properties: { result: { oneOf: [{ type: 'null' }, { allOf: [{ properties: { data: { type: 'array' } } }, { properties: { pagination: { type: 'object' } } }] }] } } }] };
      expect(pagedResponseCheck(response(composed), name, context(collectionPath))).toEqual([
        missingStart('result.pagination', 'allOf', 0, 'properties', 'result', 'oneOf', 1, 'allOf', 1, 'properties', 'pagination'),
      ]);
    });

    test('detail paths skip a missing nested block but still validate a declared one', () => {
      const detail = ['paths', '/items/{id}', 'get', 'responses', '200'];
      const name = option('result.pagination');
      expect(pagedResponseCheck(response({ type: 'object', properties: { result: { type: 'object', properties: { data: { type: 'array' } } } } }), name, context(detail))).toEqual([]);
      expect(pagedResponseCheck(response({ type: 'object', properties: { result: { type: 'array' } } }), name, context(detail))).toEqual([]);
      expect(pagedResponseCheck(response(wrapped), name, context(detail))).toEqual([
        { message: "OAR034: 'result.pagination' must include required properties: start", path: [...detail, ...RESPONSE_SCHEMA, 'properties', 'result', 'properties', 'pagination', 'properties'] },
      ]);
    });

    test('Swagger 2.0 responses resolve the nested block from the response schema', () => {
      const swagger = { path: collectionPath, rule: { name: 'apiq:OAR034' }, document: { data: { swagger: '2.0' } } };
      expect(pagedResponseCheck({ description: 'Ok', schema: wrapped }, option('result.pagination'), swagger)).toEqual([
        { message: "OAR034: 'result.pagination' must include required properties: start", path: [...collectionPath, 'schema', 'properties', 'result', 'properties', 'pagination', 'properties'] },
      ]);
    });
  });
});
