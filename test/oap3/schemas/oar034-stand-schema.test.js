const { linterForRule } = require('../../helpers/utils');

const pagedResponseCheck = require('../../../functions/apq-paged-response-check');

const oar034fail = require('./OAR034/fail-example');
const oar034ok = require('./OAR034/ok-example');
const okSingleResource = require('./OAR034/ok-single-resource-inner-arrays');
const okNotEvaluated = require('./OAR034/ok-not-evaluated');
const failCollectionShapes = require('./OAR034/fail-collection-shapes');
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
const failPathFilter = require('./OAR034/fail-path-filter');
const okPathFilter = require('./OAR034/ok-path-filter');
const failPathFilter31 = require('./OAR034/fail-path-filter-31');
const okPathFilter31 = require('./OAR034/ok-path-filter-31');
const failPathFilter320 = require('./OAR034/fail-path-filter-320');
const okPathFilter320 = require('./OAR034/ok-path-filter-320');

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
const S1 = JSON.stringify({ ...paging(), pagingPropertyName: 'pagination' });
const S2 = JSON.stringify({ type: 'object', pagingPropertyName: 'result', required: ['pagination'], properties: { pagination: paging() } });

const RESPONSE_SCHEMA = ['content', 'application/json', 'schema'];
const at = (path, code, ...rest) => ['paths', path, 'get', 'responses', code, ...RESPONSE_SCHEMA, ...rest];
const response = (path, code, ...rest) => ['paths', path, 'get', 'responses', code, ...rest];
const NO_PAGING = (name = 'paging') => `OAR034: Collection response must include '${name}' property for pagination`;
const TOP_LEVEL_ARRAY = (name = 'paging') => `OAR034: Collection response must be an object with a '${name}' property, not a top-level array`;
const NO_SCHEMA = (name = 'paging') => `OAR034: Collection response must define a schema with a '${name}' property`;

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

let linter;

const findings = async (document, custom = linter) => sorted((await custom.run(document))
  .filter((r) => r.code === 'apiq:OAR034')
  .map((r) => [r.path, r.message]));

const withOptions = (functionOptions) => linterForRule('apiq:OAR034', { functionOptions });

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

describe('apiq:OAR034 acceptance criteria — path based detection of paged collections', () => {
  const document = (paths, components) => ({ openapi: '3.0.3', info: { title: 'Users API', version: '1.0.0' }, paths, ...(components ? { components } : {}) });
  const json = (schema, mediaType = 'application/json') => ({ description: 'Ok', content: { [mediaType]: { schema } } });
  const withoutPaging = { type: 'object', properties: { name: { type: 'string' } } };
  const get = (path, responses, verb = 'get') => document({ [path]: { [verb]: { responses } } });

  test.each([
    ['/users', true],
    ['/users/get', true],
    ['/users/{id}/orders', true],
    ['/users/me/orders', true],
    ['/users/{id}/orders.{format}', true],
    ['/users/{id}/', true],
    ['/', true],
    ['/users/{id}', false],
    ['/files/{name}.json', false],
    ['/users/{id}:activate', false],
    ['/reports/{year}-{month}', false],
    ['/me', false],
    ['/users/me', false],
    ['/status', false],
    ['/health', false],
    ['/ping', false],
  ])('GET %s with an object without paging is reported: %s', async (path, reported) => {
    expect(await findings(get(path, { 200: json(withoutPaging) }))).toEqual(reported ? [[at(path, '200'), NO_PAGING()]] : []);
  });

  test('detail paths are not evaluated even if they declare a non compliant paging', async () => {
    const schema = { type: 'object', properties: { paging: { type: 'object', properties: { start: { type: 'string' } } } } };
    expect(await findings(get('/users/{id}', { 200: json(schema) }))).toEqual([]);
  });

  test('operations other than GET are not evaluated', async () => {
    expect(await findings(get('/users', { 200: json(withoutPaging) }, 'post'))).toEqual([]);
  });

  describe('response definition on a collection path', () => {
    const allOfPaging = document(
      { '/users': { get: { responses: { 200: json({ allOf: [{ $ref: '#/components/schemas/PagingEnvelope' }, { type: 'object', properties: { data: { type: 'array' } } }] }) } } } },
      { schemas: { Paging: paging(), PagingEnvelope: { type: 'object', properties: { paging: { $ref: '#/components/schemas/Paging' } } } } },
    );
    const pagingWith = (change) => {
      const block = paging();
      change(block);
      return { type: 'object', properties: { data: { type: 'array' }, paging: block } };
    };

    test.each([
      ['a 200 response without content', get('/users', { 200: { description: 'Ok' } }), [[response('/users', '200'), NO_SCHEMA()]]],
      ['a 200 response with an empty content', get('/users', { 200: { description: 'Ok', content: {} } }), [[response('/users', '200', 'content'), NO_SCHEMA()]]],
      ['a 200 application/json response without schema', get('/users', { 200: { description: 'Ok', content: { 'application/json': {} } } }), [[response('/users', '200', 'content', 'application/json'), NO_SCHEMA()]]],
      ['a 200 response whose schema is a top-level array', get('/users', { 200: json({ type: 'array', items: { type: 'string' } }) }), [[at('/users', '200'), TOP_LEVEL_ARRAY()]]],
      ['a 200 response whose schema is an object without paging', get('/users', { 200: json(withoutPaging) }), [[at('/users', '200'), NO_PAGING()]]],
      ['a 200 response whose paging.start is of type number', get('/users', { 200: json(pagingWith((block) => { block.properties.start = { type: 'number' }; })) }),
        [[at('/users', '200', 'properties', 'paging', 'properties', 'start', 'type'), "OAR034: 'paging.start' must be of type integer"]]],
      ['a 200 response whose paging does not define links', get('/users', { 200: json(pagingWith((block) => { delete block.properties.links; })) }),
        [[at('/users', '200', 'properties', 'paging', 'properties'), "OAR034: 'paging' must include required properties: links"]]],
      ['a 200 response with a paging compliant with paging-schema', get('/users', { 200: json(pagingWith(() => {})) }), []],
      ['a 200 response whose compliant paging comes from a $ref in allOf', allOfPaging, []],
      ['a 206 response whose schema is an object without paging', get('/users', { 206: json(withoutPaging) }), [[at('/users', '206'), NO_PAGING()]]],
      ['a 2XX response whose schema is an object without paging', get('/users', { '2XX': json(withoutPaging) }), [[at('/users', '2XX'), NO_PAGING()]]],
      ['only a 204 response', get('/users', { 204: { description: 'No content' } }), []],
      ['a compliant 200 response and a 400 response without paging', get('/users', { 200: json(pagingWith(() => {})), 400: json(withoutPaging) }), []],
    ])('%s', async (_, doc, expected) => {
      expect(await findings(doc)).toEqual(expected);
    });
  });

  describe('root and nested paging with a custom paging-schema', () => {
    const compliant = paging();
    test.each([
      ['S1 and a compliant pagination', S1, { type: 'object', properties: { pagination: compliant } }, []],
      ['S1 and a compliant pagination nested under result', S1, { type: 'object', properties: { result: { type: 'object', properties: { pagination: compliant } } } },
        [[at('/users', '200'), NO_PAGING('pagination')]]],
      ['S2 and a compliant pagination nested under result', S2, { type: 'object', properties: { result: { type: 'object', required: ['pagination'], properties: { pagination: compliant } } } }, []],
      ['S2 and a result.pagination.start of type number', S2,
        { type: 'object', properties: { result: { type: 'object', required: ['pagination'], properties: { pagination: { ...compliant, properties: { ...compliant.properties, start: { type: 'number' } } } } } } },
        [[at('/users', '200', 'properties', 'result', 'properties', 'pagination', 'properties', 'start', 'type'), "OAR034: 'result.pagination.start' must be of type integer"]]],
      ['S2 and a result without pagination', S2, { type: 'object', properties: { result: { type: 'object', properties: { data: { type: 'array' } } } } },
        [[at('/users', '200', 'properties', 'result', 'properties'), "OAR034: 'result' must include required properties: pagination"]]],
    ])('%s', async (_, pagingSchema, schema, expected) => {
      expect(await findings(get('/users', { 200: json(schema) }), await withOptions({ 'paging-schema': pagingSchema }))).toEqual(expected);
    });
  });

  describe('media types in OpenAPI 3', () => {
    const contentOf = (mediaTypes) => ({ 200: { description: 'Ok', content: Object.fromEntries(mediaTypes.map((mediaType) => [mediaType, { schema: withoutPaging }])) } });
    const reportedOn = (mediaType) => [['paths', '/users', 'get', 'responses', '200', 'content', mediaType, 'schema'], NO_PAGING()];
    test.each([
      [['application/json'], [reportedOn('application/json')]],
      [['application/json; charset=utf-8'], [reportedOn('application/json; charset=utf-8')]],
      [['Application/JSON'], [reportedOn('Application/JSON')]],
      [['application/hal+json'], [reportedOn('application/hal+json')]],
      [['application/vnd.api+json'], [reportedOn('application/vnd.api+json')]],
      [['*/*'], [reportedOn('*/*')]],
      [['application/*'], [reportedOn('application/*')]],
      [['text/csv'], []],
      [['application/pdf', 'application/octet-stream'], []],
      [['application/json', 'text/csv'], [reportedOn('application/json')]],
    ])('%j', async (mediaTypes, expected) => {
      expect(await findings(get('/users', contentOf(mediaTypes)))).toEqual(expected);
    });
  });

  describe('exclusion patterns in paths with pathValidationStrategy /exclude', () => {
    const P1 = '/settings';
    const P2 = '/users/*/profile';
    const P3 = '**/me';
    test.each([
      [P1, '/settings', false],
      [P1, '/settings/history', true],
      [P1, '/api/settings', true],
      [P2, '/users/{id}/profile', false],
      [P2, '/users/{id}/profile/photos', true],
      [P2, '/users/profile', true],
      [P3, '/me', false],
      [P3, '/users/me', false],
      [P3, '/tenants/{tenantId}/users/me', false],
      [P3, '/users/me/orders', true],
      [P3, '/users/meetings', true],
      [`${P1} , ${P3}`, '/settings', false],
      [`${P1} , ${P3}`, '/users/me', false],
      ['', '/status', true],
    ])('%j on GET %s is reported: %s', async (pattern, path, reported) => {
      const custom = await withOptions({ paths: pattern });
      expect(await findings(get(path, { 200: json(withoutPaging) }), custom)).toEqual(reported ? [[at(path, '200'), NO_PAGING()]] : []);
    });
  });
});

describe('apiq:OAR034 OpenAPI 3.0 — collection detection by path', () => {
  test('the documented non-compliant 206 collection is reported', async () => {
    expect(await findings(oar034fail)).toEqual([[at('/endpoint', '206'), NO_PAGING()]]);
  });

  test('error, default, 204, 304, non-GET, callback and detail responses are never evaluated', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });

  test('every response shape on a collection path needs the paging property, and only JSON media types are evaluated', async () => {
    expect(await findings(failCollectionShapes)).toEqual(sorted([
      [at('/catalog/summary', '200'), NO_PAGING()],
      [at('/catalog/forms/latest', '200'), NO_PAGING()],
      [at('/catalog/anything', '200'), NO_PAGING()],
      [response('/catalog/nothing', '200'), NO_SCHEMA()],
      [response('/catalog/empty-content', '200', 'content'), NO_SCHEMA()],
      [response('/catalog/no-schema', '200', 'content', 'application/json'), NO_SCHEMA()],
      [response('/catalog/not-a-schema', '200', 'content', 'application/json'), NO_SCHEMA()],
      [at('/catalog/scalars', '200'), NO_PAGING()],
      [at('/catalog/union', '200'), NO_PAGING()],
    ]));
  });

  test('singleton resources on collection paths are reported unless paths excludes them', async () => {
    expect(await findings(okSingleResource)).toEqual(sorted([
      [at('/emails/{emailStore}/last', '200'), NO_PAGING()],
      [at('/emails/{emailStore}/last-content', '200'), NO_PAGING()],
    ]));
    expect(await findings(okSingleResource, await withOptions({ paths: '/emails/*/last, /emails/*/last-content' }))).toEqual([]);
  });

  test('a top-level array is reported, typed, untyped with items, $ref-ed or nullable', async () => {
    expect(await findings(failTopLevelArray)).toEqual(sorted([
      [at('/brokers', '200'), TOP_LEVEL_ARRAY()],
      [at('/agencies', '200'), TOP_LEVEL_ARRAY()],
      [at('/regions', '200'), TOP_LEVEL_ARRAY()],
      [at('/branches', '200'), TOP_LEVEL_ARRAY()],
    ]));
  });

  test('objects without paging are reported in 200, 206 and 2XX, and an XML media type is not evaluated', async () => {
    const paths = ['/policies', '/claims', '/customers', '/quotes', '/renewals', '/invoices', '/payments', '/vehicles', '/drivers', '/workshops', '/repairs', '/estimates',
      '/appraisals', '/policies/{policyId}/claims', '/documents', '/branches', '/coverages', '/invoices-export'];
    expect(await findings(failCollectionWithoutPaging)).toEqual(sorted([
      ...paths.map((path) => [at(path, '200'), NO_PAGING()]),
      [at('/endorsements', '2XX'), NO_PAGING()],
      [at('/tariffs', '206'), NO_PAGING()],
    ]));
  });
});

describe('apiq:OAR034 OpenAPI 3.0 — paging block structure', () => {
  test('required properties, required lists, types and the nested links object are validated on collection paths only', async () => {
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
    ]));
  });
});

describe('apiq:OAR034 OpenAPI 3.0 — $ref resolution', () => {
  test('component responses, aliases, allOf envelopes and shared paging blocks are followed', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING()],
      [['paths', '/regions', 'get', 'responses', '206', ...RESPONSE_SCHEMA], NO_PAGING()],
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
      [at('/policies', '200'), NO_PAGING()],
      [at('/brokers', '200'), TOP_LEVEL_ARRAY()],
      [at('/null-first', '200'), TOP_LEVEL_ARRAY()],
      [at('/claims', '200', 'anyOf', '0'), NO_PAGING()],
      [at('/workshops', '200'), NO_PAGING()],
      [at('/vehicles', '200'), NO_PAGING()],
      [at('/customers', '200', 'properties', 'paging'), "OAR034: 'paging' must list as required: start, limit, links"],
      [at('/quotes', '200', 'properties', 'paging', 'properties', 'start', 'type'), "OAR034: 'paging.start' must be of type integer"],
      [at('/renewals', '200', 'properties', 'paging', 'type'), "OAR034: 'paging' must be of type object"],
      [at('/repairs', '200', 'properties', 'paging', 'oneOf', '0', 'properties'), "OAR034: 'paging' must include required properties: start"],
      [at('/drivers', '200', 'properties', 'paging', 'properties', 'total', 'type'), "OAR034: 'paging.total' must be of type integer"],
      [at('/drivers', '200', 'properties', 'paging', 'properties', 'links', 'required'), "OAR034: 'paging.links' must list as required: next"],
      [at('/archived-policies', '200'), NO_PAGING()],
      [at('/fleets', '200'), NO_PAGING()],
    ]));
  });

  test('compliant 3.1 paging with nullable forms, $ref siblings, pathItems and $defs reports nothing once the /fleet singletons are excluded', async () => {
    expect(await findings(okExample31)).toEqual(sorted([
      [at('/fleet/label', '200'), NO_PAGING()],
      [at('/fleet/nothing', '200'), NO_PAGING()],
      [at('/fleet/status', '200'), NO_PAGING()],
    ]));
    expect(await findings(okExample31, await withOptions({ paths: '/fleet/*' }))).toEqual([]);
  });
});

describe('apiq:OAR034 OpenAPI 3.2', () => {
  test('components.mediaTypes, response summaries and a JSON schema next to an itemSchema are evaluated', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      [at('/claims', '200'), NO_PAGING()],
      [at('/losses', '200'), NO_PAGING()],
      [at('/contractors', '200'), NO_PAGING()],
      [at('/settlements', '2XX'), NO_PAGING()],
      [at('/appointments', '200', 'properties', 'paging', 'properties', 'limit', 'type'), "OAR034: 'paging.limit' must be of type integer"],
      [at('/appointments', '200', 'properties', 'paging', 'properties', 'links', 'required'), "OAR034: 'paging.links' must list as required: previous"],
    ]));
  });

  test('itemSchema streams, QUERY, additionalOperations and webhooks are not evaluated', async () => {
    expect(await findings(okExample320)).toEqual([]);
  });
});

describe('apiq:OAR034 nested paging with pagingPropertyName set to the wrapper (S2)', () => {
  let nested;

  beforeAll(async () => {
    nested = await withOptions({ 'paging-schema': S2 });
  });

  const common = (prefix = []) => [
    [at('/audit-events', '200'), NO_PAGING('result')],
    [at('/devices', '200'), TOP_LEVEL_ARRAY('result')],
    [response('/exports', '200'), NO_SCHEMA('result')],
    [at('/groups', '200', 'properties', 'result', 'properties', 'pagination'), "OAR034: 'result.pagination' must include required properties: start, limit, links"],
    [at('/invitations', '200', 'properties', 'result'), "OAR034: 'result' must list as required: pagination"],
    [['paths', '/locales', 'get', 'responses', '200', 'content', 'application/hal+json', 'schema'], NO_PAGING('result')],
    [at('/notifications', '200', 'properties', 'result', 'properties'), "OAR034: 'result' must include required properties: pagination"],
    [at('/organizations', '200', 'allOf', '0', 'properties', 'result', 'allOf', '0', 'properties', 'pagination'), "OAR034: 'result.pagination' must list as required: start, limit, links"],
    [at('/permissions', '206', 'properties', 'result', 'properties', 'pagination', 'properties', 'start', 'type'), "OAR034: 'result.pagination.start' must be of type integer"],
    [at('/roles', '200', 'properties', 'result', 'type'), "OAR034: 'result' must be of type object"],
    [at('/teams', '2XX', 'properties', 'result', 'properties', 'pagination', 'properties', 'links', 'properties'), "OAR034: 'result.pagination.links' must include required properties: previous, next"],
    [at('/users/{userId}/sessions', '200', 'properties', 'result', 'properties'), "OAR034: 'result' must include required properties: pagination"],
    ...prefix,
  ];

  test('OpenAPI 3.0: envelopes, allOf, nullable wrappers, +json media types and missing schemas', async () => {
    expect(await findings(failNestedPaging, nested)).toEqual(sorted(common()));
    expect(await findings(okNestedPaging, nested)).toEqual([]);
  });

  test('OpenAPI 3.1: pathItems and $defs are followed, webhooks are not evaluated', async () => {
    expect(await findings(failNestedPaging31, nested)).toEqual(sorted(common([
      [at('/archived-users', '200', 'properties', 'result', 'properties'), "OAR034: 'result' must include required properties: pagination"],
      [at('/fleets', '200', 'properties', 'result', 'properties'), "OAR034: 'result' must include required properties: pagination"],
    ])));
    expect(await findings(okNestedPaging31, nested)).toEqual([]);
  });

  test('OpenAPI 3.2: components.mediaTypes, itemSchema, QUERY and additionalOperations', async () => {
    expect(await findings(failNestedPaging320, nested)).toEqual(sorted(common()));
    expect(await findings(okNestedPaging320, nested)).toEqual([]);
  });

  test('with the shipped paging-schema every wrapped collection is asked for the root paging property', async () => {
    const reported = (await findings(okNestedPaging)).map(([, message]) => message);
    expect(reported.length).toBeGreaterThan(0);
    expect(new Set(reported)).toEqual(new Set([NO_PAGING()]));
  });
});

describe('apiq:OAR034 paging-schema option', () => {
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
    expect(await findings(document, await withOptions({ 'paging-schema': cursor }))).toEqual(sorted([
      [at('/missing', '200'), NO_PAGING('pagination')],
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
    expect(await findings(document, await withOptions({ 'paging-schema': JSON.stringify(relaxed) }))).toEqual([]);
  });

  test.each([
    ['invalid JSON', '{"type":'],
    ['an empty string', ''],
    ['JSON null', 'null'],
    ['a JSON array', '[]'],
    ['a number', 42],
  ])('%s falls back to the standard paging schema', async (_, value) => {
    const custom = await withOptions({ 'paging-schema': value });
    expect(await findings(oar034fail, custom)).toEqual([[at('/endpoint', '206'), NO_PAGING()]]);
    expect(await findings(oar034ok, custom)).toEqual([]);
  });
});

describe('apiq:OAR034 paths and pathValidationStrategy options', () => {
  const PATH_FINDINGS = {
    '/me': [at('/me', '200'), NO_PAGING()],
    '/health': [at('/health', '200'), TOP_LEVEL_ARRAY()],
    '/ping': [at('/ping', '200', 'properties', 'paging'), "OAR034: 'paging' must include required properties: start, limit, links"],
    '/status': [at('/status', '200'), NO_PAGING()],
    '/users': [at('/users', '200'), NO_PAGING()],
    '/users/me': [at('/users/me', '200'), NO_PAGING()],
    '/users/me/sessions': [at('/users/me/sessions', '200'), TOP_LEVEL_ARRAY()],
    '/reports': [at('/reports', '200'), NO_PAGING()],
  };
  const EVALUATED = Object.keys(PATH_FINDINGS);
  const only = (paths) => sorted(paths.map((path) => PATH_FINDINGS[path]));
  const except = (paths) => only(EVALUATED.filter((path) => !paths.includes(path)));
  const SHIPPED = ['/status', '/health', '/ping', '/me', '/users/me'];

  const VERSIONS = [
    ['OpenAPI 3.0', failPathFilter, okPathFilter],
    ['OpenAPI 3.1', failPathFilter31, okPathFilter31],
    ['OpenAPI 3.2', failPathFilter320, okPathFilter320],
  ];

  const CASES = [
    ['the shipped patterns exclude /status, /health, /ping and every path ending in /me', undefined, except(SHIPPED)],
    ['an empty value excludes nothing, the detail path is still never evaluated', { paths: '' }, only(EVALUATED)],
    ['a configured list replaces the shipped one', { paths: '/users,/reports' }, except(['/users', '/reports'])],
    ['spaces and empty items are ignored', { paths: ' /users , , /reports ' }, except(['/users', '/reports'])],
    ['**/me alone keeps /status, /health and /ping evaluated', { paths: '**/me' }, except(['/me', '/users/me'])],
    ['* matches exactly one segment', { paths: '/users/*' }, except(['/users/me'])],
    ['* matches a segment in the middle', { paths: '/users/*/sessions' }, except(['/users/me/sessions'])],
    ['** matches zero or more segments', { paths: '/users/**' }, except(['/users', '/users/me', '/users/me/sessions'])],
    ['** alone excludes every path', { paths: '**' }, []],
    ['/* excludes every single segment path', { paths: '/*' }, only(['/users/me', '/users/me/sessions'])],
    ['**/sessions matches the last segment', { paths: '**/sessions' }, except(['/users/me/sessions'])],
    ['patterns are case sensitive', { paths: '/USERS,/Reports' }, only(EVALUATED)],
    ['a trailing slash is a different path', { paths: '/users/,/reports/' }, only(EVALUATED)],
    ['a pattern without leading slash does not match', { paths: 'users,reports' }, only(EVALUATED)],
    ['patterns are not regular expressions', { paths: '/user.*,^/reports$' }, only(EVALUATED)],
    ['an array of patterns is accepted', { paths: ['/users', '**/sessions'] }, except(['/users', '/users/me/sessions'])],
    ['a value that is not a list is no list of paths', { paths: 42 }, only(EVALUATED)],
    ['/include only evaluates the matching paths', { paths: '/users/**', pathValidationStrategy: '/include' }, only(['/users', '/users/me', '/users/me/sessions'])],
    ['/include with the shipped patterns only evaluates them', { pathValidationStrategy: '/include' }, only(SHIPPED)],
    ['/include with **/me', { paths: '**/me', pathValidationStrategy: '/include' }, only(['/me', '/users/me'])],
    ['/include with an empty list evaluates nothing', { paths: '', pathValidationStrategy: '/include' }, []],
    ['include without slash', { paths: '/users,/reports', pathValidationStrategy: 'include' }, only(['/users', '/reports'])],
    ['include in upper case and padded', { paths: '/users,/reports', pathValidationStrategy: ' /INCLUDE ' }, only(['/users', '/reports'])],
    ['exclude without slash', { paths: '/users', pathValidationStrategy: 'exclude' }, except(['/users'])],
    ['an unknown strategy behaves as /exclude', { paths: '/users', pathValidationStrategy: 'only' }, except(['/users'])],
    ['a non-string strategy behaves as /exclude', { paths: '/users', pathValidationStrategy: 1 }, except(['/users'])],
  ];

  describe.each(VERSIONS)('%s', (_, fail, ok) => {
    test.each(CASES)('%s', async (__, functionOptions, expected) => {
      const custom = functionOptions === undefined ? linter : await withOptions(functionOptions);
      expect(await findings(fail, custom)).toEqual(expected);
    });

    test('the compliant directory reports nothing with the shipped patterns and only the excluded paths without them', async () => {
      expect(await findings(ok)).toEqual([]);
      expect(await findings(ok, await withOptions({ paths: '' }))).toEqual(only(['/me', '/health', '/ping', '/status']));
    });
  });
});

describe('apq-paged-response-check function', () => {
  const context = (path, extra = {}) => ({ path, rule: { name: 'apiq:OAR034' }, document: { data: { openapi: '3.1.0' } }, ...extra });
  const oas3Response = (schema, mediaType = 'application/json') => ({ description: 'Ok', content: { [mediaType]: { schema } } });
  const collectionPath = ['paths', '/items', 'get', 'responses', '200'];
  const responseOn = (path, code = '200') => ['paths', path, 'get', 'responses', code];

  test('non-object responses and non-success codes produce nothing', () => {
    expect(pagedResponseCheck(null, {}, context(collectionPath))).toEqual([]);
    expect(pagedResponseCheck('Ok', {}, context(collectionPath))).toEqual([]);
    const collection = oas3Response({ type: 'array' });
    expect(pagedResponseCheck(collection, {}, context(responseOn('/items', '204')))).toEqual([]);
    expect(pagedResponseCheck(collection, {}, context(responseOn('/items', '404')))).toEqual([]);
    expect(pagedResponseCheck(collection, {}, context(responseOn('/items', 'default')))).toEqual([]);
    expect(pagedResponseCheck(collection, {}, context(responseOn('/items', '2xx')))).toHaveLength(1);
  });

  test('the rule code falls back to OAR034 without a rule name and options may be absent', () => {
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), undefined, { path: collectionPath, document: { data: {} } })).toEqual([
      { message: TOP_LEVEL_ARRAY(), path: [...collectionPath, ...RESPONSE_SCHEMA] },
    ]);
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), null, context(collectionPath))).toHaveLength(1);
  });

  test('the option can be passed as an object and the property name is trimmed', () => {
    const template = { pagingPropertyName: ' meta ', required: ['cursor'] };
    const schema = { type: 'object', properties: { data: { type: 'array' }, meta: { type: 'object', properties: { next: {} } } } };
    expect(pagedResponseCheck(oas3Response(schema), { 'paging-schema': template }, context(collectionPath))).toEqual([
      { message: "OAR034: 'meta' must include required properties: cursor", path: [...collectionPath, ...RESPONSE_SCHEMA, 'properties', 'meta', 'properties'] },
    ]);
  });

  test('a dotted pagingPropertyName is a literal property name', () => {
    const template = { pagingPropertyName: 'result.pagination', required: ['start'] };
    const nested = { type: 'object', properties: { result: { type: 'object', properties: { pagination: { type: 'object', properties: { start: {} } } } } } };
    const literal = { type: 'object', properties: { 'result.pagination': { type: 'object', properties: { start: {} } } } };
    expect(pagedResponseCheck(oas3Response(nested), { 'paging-schema': template }, context(collectionPath))).toEqual([
      { message: NO_PAGING('result.pagination'), path: [...collectionPath, ...RESPONSE_SCHEMA] },
    ]);
    expect(pagedResponseCheck(oas3Response(literal), { 'paging-schema': template }, context(collectionPath))).toEqual([
      { message: "OAR034: 'result.pagination' must list as required: start", path: [...collectionPath, ...RESPONSE_SCHEMA, 'properties', 'result.pagination'] },
    ]);
  });

  test('self-referencing allOf and oneOf chains terminate', () => {
    const cyclicAllOf = { type: 'object', properties: { data: { type: 'array' } } };
    cyclicAllOf.allOf = [cyclicAllOf];
    const cyclicOneOf = { oneOf: [{ type: 'null' }] };
    cyclicOneOf.oneOf.push(cyclicOneOf);
    expect(pagedResponseCheck(oas3Response(cyclicAllOf), {}, context(collectionPath))).toEqual([{ message: NO_PAGING(), path: [...collectionPath, ...RESPONSE_SCHEMA] }]);
    expect(pagedResponseCheck(oas3Response(cyclicOneOf), {}, context(collectionPath))).toHaveLength(1);
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
    expect(pagedResponseCheck(oas3Response(schema), { 'paging-schema': template }, context(collectionPath))).toEqual([]);
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
    expect(pagedResponseCheck(oas3Response(schema), { 'paging-schema': template }, context(collectionPath))).toEqual([
      { message: "OAR034: 'paging.links[]' must list as required: href", path: [...linksPath, 'required'] },
      { message: "OAR034: 'paging.links[].href' must be of type string", path: [...linksPath, 'properties', 'href', 'type'] },
    ]);
  });

  test.each([
    ['/users/{id}', true],
    ['/files/{name}.json', true],
    ['/users/{id}:activate', true],
    ['/reports/{year}-{month}', true],
    ['/{tenant}', true],
    ['/v1/{a}{b}', true],
    ['/users/{id}/orders.{format}', false],
    ['/users/{id}/', false],
    ['/users/x{id}', false],
    ['/', false],
    ['', false],
  ])('%j is a detail path: %s', (path, detail) => {
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), { paths: '' }, context(responseOn(path)))).toHaveLength(detail ? 0 : 1);
  });

  test.each([
    ['application/json', true],
    ['APPLICATION/JSON', true],
    ['application/json; charset=utf-8', true],
    ['application/json;', true],
    ['application/problem+json', true],
    ['application/vnd.api+json; version=2', true],
    ['text/x-custom+json', true],
    ['*/*', true],
    ['application/*', true],
    ['*/json', true],
    ['json', true],
    ['application/', true],
    ['application/json/extra', true],
    ['appl ication/json', true],
    [' ', true],
    ['text/*', false],
    ['text/json', false],
    ['application/jsonl', false],
    ['application/json-seq', false],
    ['application/x-ndjson', false],
    ['application/xml', false],
    ['text/plain', false],
    ['multipart/form-data', false],
  ])('the %j media type is evaluated: %s', (mediaType, evaluated) => {
    expect(pagedResponseCheck(oas3Response({ type: 'array' }, mediaType), {}, context(collectionPath))).toHaveLength(evaluated ? 1 : 0);
  });

  test.each([
    ['/users/**', '/users', true],
    ['/users/**', '/users/{id}/orders', true],
    ['**', '/', true],
    ['/*', '/', true],
    ['/*', '/users', true],
    ['*', '/users', false],
    ['**/me', '/me', true],
    ['**/me', '/users/{id}/me', true],
    ['/a/**/b', '/a/b', true],
    ['/a/**/b', '/a/x/y/b', true],
    ['/a/**/b', '/a/x/y/c', false],
    ['/users/{id}/orders', '/users/{id}/orders', true],
    ['/users/*/orders', '/users/{id}/orders', true],
    ['/users/*/orders', '/users/orders', false],
    ['/users/a*', '/users/abc', false],
    ['/users/a*', '/users/a*', true],
  ])('the pattern %j excludes %j: %s', (pattern, path, excluded) => {
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), { paths: pattern }, context(responseOn(path)))).toHaveLength(excluded ? 0 : 1);
  });

  test('without a paths option the shipped patterns apply, and a value that is not a list excludes nothing', () => {
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), {}, context(responseOn('/tenants/{id}/me')))).toEqual([]);
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), { pathValidationStrategy: '/exclude' }, context(responseOn('/status')))).toEqual([]);
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), { paths: null }, context(responseOn('/status')))).toHaveLength(1);
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), { paths: [7, null] }, context(responseOn('/status')))).toHaveLength(1);
  });

  test.each([
    ['/users/**', '/users/{id}/orders', true],
    ['/users/**', '/orders', false],
    ['**/me', '/me', true],
    ['', '/users', false],
  ])('/include with %j evaluates %j: %s', (pattern, path, evaluated) => {
    const options = { paths: pattern, pathValidationStrategy: '/include' };
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), options, context(responseOn(path)))).toHaveLength(evaluated ? 1 : 0);
  });

  test('a detail path is never evaluated, not even when /include lists it', () => {
    const options = { paths: '/users/{id}', pathValidationStrategy: '/include' };
    expect(pagedResponseCheck(oas3Response({ type: 'array' }), options, context(responseOn('/users/{id}')))).toEqual([]);
  });

  test('unresolved $ref responses, media types and schemas are not evaluated', () => {
    expect(pagedResponseCheck({ $ref: './missing.yaml#/Response' }, {}, context(collectionPath))).toEqual([]);
    expect(pagedResponseCheck({ description: 'Ok', content: { 'application/json': { $ref: '#/missing' } } }, {}, context(collectionPath))).toEqual([]);
    expect(pagedResponseCheck(oas3Response({ $ref: './missing.yaml#/Page' }), {}, context(collectionPath))).toEqual([]);
  });

  test('a JSON media type whose value is not an object is a missing schema', () => {
    expect(pagedResponseCheck({ description: 'Ok', content: { 'application/json': 'schema' } }, {}, context(collectionPath))).toEqual([
      { message: NO_SCHEMA(), path: [...collectionPath, 'content', 'application/json'] },
    ]);
  });

  describe('Swagger 2.0', () => {
    const swagger = (data, extra = {}) => ({ path: collectionPath, rule: { name: 'apiq:OAR034' }, document: { data: { swagger: '2.0', ...data } }, ...extra });

    test('the response schema is read directly and a missing one is reported', () => {
      expect(pagedResponseCheck({ description: 'Ok', schema: { type: 'array' } }, {}, swagger({}))).toEqual([
        { message: TOP_LEVEL_ARRAY(), path: [...collectionPath, 'schema'] },
      ]);
      expect(pagedResponseCheck(oas3Response({ type: 'array' }), {}, swagger({}))).toEqual([
        { message: NO_SCHEMA(), path: collectionPath },
      ]);
    });

    test('produces comes from the operation, then from the root, and an empty list falls back', () => {
      const withProduces = (operation, root) => swagger({ ...(root ? { produces: root } : {}), paths: { '/items': { get: { ...(operation ? { produces: operation } : {}) } } } });
      const reported = (ctx) => pagedResponseCheck({ description: 'Ok', schema: { type: 'array' } }, {}, ctx).length;
      expect(reported(withProduces(['text/csv'], ['application/json']))).toBe(0);
      expect(reported(withProduces(['application/json'], ['text/csv']))).toBe(1);
      expect(reported(withProduces(null, ['application/pdf']))).toBe(0);
      expect(reported(withProduces([], ['application/pdf']))).toBe(0);
      expect(reported(withProduces([], []))).toBe(1);
      expect(reported(withProduces(['text/csv', 'application/hal+json'], null))).toBe(1);
    });

    test('the resolved document is preferred to read produces', () => {
      const ctx = swagger({ paths: { '/items': { $ref: '#/x-paths/Items' } } }, {
        documentInventory: { resolved: { swagger: '2.0', paths: { '/items': { get: { produces: ['text/csv'] } } } } },
      });
      expect(pagedResponseCheck({ description: 'Ok', schema: { type: 'array' } }, {}, ctx)).toEqual([]);
    });

    test('an unresolved $ref schema is not evaluated', () => {
      expect(pagedResponseCheck({ description: 'Ok', schema: { $ref: './missing.yaml#/Page' } }, {}, swagger({}))).toEqual([]);
    });
  });
});
