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
});
