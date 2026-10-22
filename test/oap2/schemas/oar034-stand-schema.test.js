const { linterForRule } = require('../../helpers/utils');

const oar034fail = require('./OAR034/fail-example');
const oar034ok = require('./OAR034/ok-example');
const okSingleResource = require('./OAR034/ok-single-resource-inner-arrays');
const okNotEvaluated = require('./OAR034/ok-not-evaluated');
const failCollectionShapes = require('./OAR034/fail-collection-shapes');
const okRefs = require('./OAR034/ok-refs');
const failCollectionWithoutPaging = require('./OAR034/fail-collection-without-paging');
const failPagingStructure = require('./OAR034/fail-paging-structure');
const failRefs = require('./OAR034/fail-refs');
const failNestedPaging = require('./OAR034/fail-nested-paging');
const okNestedPaging = require('./OAR034/ok-nested-paging');
const failPathFilter = require('./OAR034/fail-path-filter');
const okPathFilter = require('./OAR034/ok-path-filter');

const at = (path, code, ...rest) => ['paths', path, 'get', 'responses', code, 'schema', ...rest];
const response = (path, code) => ['paths', path, 'get', 'responses', code];
const NO_PAGING = (name = 'paging') => `OAR034: Collection response must include '${name}' property for pagination`;
const TOP_LEVEL_ARRAY = (name = 'paging') => `OAR034: Collection response must be an object with a '${name}' property, not a top-level array`;
const NO_SCHEMA = (name = 'paging') => `OAR034: Collection response must define a schema with a '${name}' property`;

const link = { type: 'object', properties: { href: { type: 'string' } } };
const paging = () => ({
  type: 'object',
  required: ['start', 'limit', 'links'],
  properties: {
    start: { type: 'integer' },
    limit: { type: 'integer' },
    total: { type: 'integer' },
    numPages: { type: 'integer' },
    links: { type: 'object', required: ['self', 'previous', 'next'], properties: { self: link, first: link, previous: link, next: link, last: link } },
  },
});
const S2 = JSON.stringify({ type: 'object', pagingPropertyName: 'result', required: ['pagination'], properties: { pagination: paging() } });

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

describe('apiq:OAR034 Swagger 2.0 acceptance criteria', () => {
  const withoutPaging = { type: 'object', properties: { name: { type: 'string' } } };
  const document = ({ root, operation, path = '/users', responseObject = { description: 'Ok', schema: withoutPaging } }) => ({
    swagger: '2.0',
    info: { title: 'Users API', version: '1.0.0' },
    ...(root ? { produces: root } : {}),
    paths: { [path]: { get: { ...(operation ? { produces: operation } : {}), responses: { 200: responseObject } } } },
  });

  test.each([
    ['produces is not defined at operation or root level', {}, true],
    ['the operation produces is application/json', { operation: ['application/json'] }, true],
    ['the root produces is text/csv and the operation does not define produces', { root: ['text/csv'] }, false],
    ['the operation produces is text/csv and the root one is application/json', { operation: ['text/csv'], root: ['application/json'] }, false],
    ['the operation produces is application/json and text/csv', { operation: ['application/json', 'text/csv'] }, true],
  ])('%s', async (_, produces, reported) => {
    expect(await findings(document(produces))).toEqual(reported ? [[at('/users', '200'), NO_PAGING()]] : []);
  });

  test('a response without schema and without produces is reported', async () => {
    expect(await findings(document({ responseObject: { description: 'Ok' } }))).toEqual([[response('/users', '200'), NO_SCHEMA()]]);
  });

  test.each([
    ['/users/{id}/orders.{format}', true],
    ['/users/me/orders', true],
    ['/', true],
    ['/users/{id}', false],
    ['/files/{name}.json', false],
    ['/users/me', false],
    ['/status', false],
  ])('GET %s with an object without paging is reported: %s', async (path, reported) => {
    expect(await findings(document({ path }))).toEqual(reported ? [[at(path, '200'), NO_PAGING()]] : []);
  });

  test('paths patterns apply to Swagger 2.0 paths', async () => {
    const custom = await withOptions({ paths: '/users/*/profile, **/me' });
    expect(await findings(document({ path: '/users/{id}/profile' }), custom)).toEqual([]);
    expect(await findings(document({ path: '/tenants/{t}/me' }), custom)).toEqual([]);
    expect(await findings(document({ path: '/status' }), custom)).toEqual([[at('/status', '200'), NO_PAGING()]]);
  });
});

describe('apiq:OAR034 Swagger 2.0', () => {
  test('the documented non-compliant 206 collection is reported on the response schema', async () => {
    expect(await findings(oar034fail)).toEqual([[at('/endpoint', '206'), NO_PAGING()]]);
  });

  test('singleton resources on collection paths are reported unless paths excludes them', async () => {
    expect(await findings(okSingleResource)).toEqual(sorted([
      [at('/emails/{emailStore}/last', '200'), NO_PAGING()],
      [at('/emails/{emailStore}/last-content', '200'), NO_PAGING()],
    ]));
    expect(await findings(okSingleResource, await withOptions({ paths: '/emails/*/last,/emails/*/last-content' }))).toEqual([]);
  });

  test('error, default, 204, 304, non-GET, detail and non-JSON produces responses are never evaluated', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });

  test('every response shape on a collection path with JSON produces needs the paging property', async () => {
    expect(await findings(failCollectionShapes)).toEqual(sorted([
      [response('/catalog/nothing', '200'), NO_SCHEMA()],
      [at('/catalog/file', '200'), NO_PAGING()],
      [at('/catalog/anything', '200'), NO_PAGING()],
      [at('/catalog/summary', '200'), NO_PAGING()],
      [at('/catalog/scalars', '200'), NO_PAGING()],
    ]));
  });

  test('objects without paging, x-nullable ones and top-level arrays are reported', async () => {
    expect(await findings(failCollectionWithoutPaging)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING()],
      [at('/claims', '200'), NO_PAGING()],
      [at('/customers', '200'), NO_PAGING()],
      [at('/tariffs', '206'), NO_PAGING()],
      [at('/policies/{policyId}/claims', '200'), NO_PAGING()],
      [at('/brokers', '200'), TOP_LEVEL_ARRAY()],
      [at('/regions', '200'), TOP_LEVEL_ARRAY()],
      [at('/branches', '200'), NO_PAGING()],
    ]));
  });

  test('the paging block is validated against the standard paging schema on collection paths only', async () => {
    const paged = (path, ...rest) => at(path, '200', 'properties', 'paging', ...rest);
    expect(await findings(failPagingStructure)).toEqual(sorted([
      [paged('/missing-limit', 'properties'), "OAR034: 'paging' must include required properties: limit"],
      [paged('/not-listed', 'required'), "OAR034: 'paging' must list as required: start, limit, links"],
      [paged('/start-string', 'properties', 'start', 'type'), "OAR034: 'paging.start' must be of type integer"],
      [paged('/paging-array', 'type'), "OAR034: 'paging' must be of type object"],
      [paged('/links-self-only', 'properties', 'links', 'properties'), "OAR034: 'paging.links' must include required properties: previous, next"],
      [paged('/href-integer', 'properties', 'links', 'properties', 'self', 'properties', 'href', 'type'), "OAR034: 'paging.links.self.href' must be of type string"],
      [paged('/nullable-paging', 'required'), "OAR034: 'paging' must list as required: links"],
    ]));
  });

  test('global responses, definition aliases and allOf envelopes are followed', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING()],
      [at('/regions', '206'), NO_PAGING()],
      [at('/payments', '200', 'allOf', '0', 'properties', 'paging', 'required'), "OAR034: 'paging' must list as required: limit"],
      [at('/claims', '200', 'properties', 'paging', 'properties'), "OAR034: 'paging' must include required properties: start"],
    ]));
  });

  test('compliant paging through refs, allOf, x-nullable and recursive definitions reports nothing', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });
});

describe('apiq:OAR034 Swagger 2.0 nested paging with pagingPropertyName set to the wrapper (S2)', () => {
  test('envelopes, global responses, allOf, x-nullable, produces and missing schemas', async () => {
    const nested = await withOptions({ 'paging-schema': S2 });
    expect(await findings(failNestedPaging, nested)).toEqual(sorted([
      [at('/audit-events', '200'), NO_PAGING('result')],
      [at('/devices', '200'), TOP_LEVEL_ARRAY('result')],
      [response('/exports', '200'), NO_SCHEMA('result')],
      [at('/groups', '200', 'properties', 'result', 'properties', 'pagination'), "OAR034: 'result.pagination' must include required properties: start, limit, links"],
      [at('/invitations', '200', 'properties', 'result'), "OAR034: 'result' must list as required: pagination"],
      [at('/notifications', '200', 'properties', 'result', 'properties'), "OAR034: 'result' must include required properties: pagination"],
      [at('/organizations', '200', 'allOf', '0', 'properties', 'result', 'allOf', '0', 'properties', 'pagination'), "OAR034: 'result.pagination' must list as required: start, limit, links"],
      [at('/permissions', '206', 'properties', 'result', 'properties', 'pagination', 'properties', 'start', 'type'), "OAR034: 'result.pagination.start' must be of type integer"],
      [at('/roles', '200', 'properties', 'result', 'type'), "OAR034: 'result' must be of type object"],
      [at('/teams', '2XX', 'properties', 'result', 'properties', 'pagination', 'properties', 'links', 'properties'), "OAR034: 'result.pagination.links' must include required properties: previous, next"],
      [at('/users/{userId}/sessions', '200', 'properties', 'result', 'properties'), "OAR034: 'result' must include required properties: pagination"],
    ]));
    expect(await findings(okNestedPaging, nested)).toEqual([]);
  });
});

describe('apiq:OAR034 Swagger 2.0 paths and pathValidationStrategy options', () => {
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

  test.each([
    ['the shipped patterns exclude /status, /health, /ping and every path ending in /me', undefined, except(['/status', '/health', '/ping', '/me', '/users/me'])],
    ['an empty value excludes nothing', { paths: '' }, only(EVALUATED)],
    ['a configured list replaces the shipped one', { paths: '/users, /reports' }, except(['/users', '/reports'])],
    ['* and ** match one and any number of segments', { paths: '/users/*/sessions,**/me' }, except(['/me', '/users/me', '/users/me/sessions'])],
    ['patterns only match the whole path', { paths: '/user,/users/,reports' }, only(EVALUATED)],
    ['/include only evaluates the matching paths', { paths: '/users/**', pathValidationStrategy: '/include' }, only(['/users', '/users/me', '/users/me/sessions'])],
    ['/include with an empty list evaluates nothing', { paths: '', pathValidationStrategy: 'include' }, []],
    ['an unknown strategy behaves as /exclude', { paths: '/users', pathValidationStrategy: '/skip' }, except(['/users'])],
  ])('%s', async (_, functionOptions, expected) => {
    const custom = functionOptions === undefined ? linter : await withOptions(functionOptions);
    expect(await findings(failPathFilter, custom)).toEqual(expected);
  });

  test('the compliant directory reports nothing with the shipped patterns and only the excluded paths without them', async () => {
    expect(await findings(okPathFilter)).toEqual([]);
    expect(await findings(okPathFilter, await withOptions({ paths: '' }))).toEqual(only(['/me', '/health', '/ping', '/status']));
  });
});
