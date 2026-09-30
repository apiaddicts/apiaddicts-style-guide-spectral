const { linterForRule } = require('../../helpers/utils');

const oar034fail = require('./OAR034/fail-example');
const oar034ok = require('./OAR034/ok-example');
const okSingleResource = require('./OAR034/ok-single-resource-inner-arrays');
const okNotEvaluated = require('./OAR034/ok-not-evaluated');
const okRefs = require('./OAR034/ok-refs');
const failCollectionWithoutPaging = require('./OAR034/fail-collection-without-paging');
const failPagingStructure = require('./OAR034/fail-paging-structure');
const failRefs = require('./OAR034/fail-refs');

const at = (path, code, ...rest) => ['paths', path, 'get', 'responses', code, 'schema', ...rest];
const NO_PAGING = (prop) => `OAR034: Response with collection property '${prop}' must include 'paging' property for pagination`;
const TOP_LEVEL_ARRAY = "OAR034: Collection response must be an object with a 'paging' property, not a top-level array";

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

let linter;

const findings = async (document) => sorted((await linter.run(document))
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

describe('apiq:OAR034 Swagger 2.0', () => {
  test('the documented non-compliant 206 collection is reported on the response schema', async () => {
    expect(await findings(oar034fail)).toEqual([[at('/endpoint', '206'), NO_PAGING('items')]]);
  });

  test('a single resource with inner arrays is not a collection', async () => {
    expect(await findings(okSingleResource)).toEqual([]);
  });

  test('error, default, 204, 304, non-GET, detail, file and schemaless responses are never flagged', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });

  test('collections without paging, x-nullable ones and top-level arrays are reported', async () => {
    expect(await findings(failCollectionWithoutPaging)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING('data')],
      [at('/claims', '200'), NO_PAGING('Items')],
      [at('/customers', '200'), NO_PAGING('results')],
      [at('/tariffs', '206'), NO_PAGING('content')],
      [at('/policies/{policyId}/claims', '200'), NO_PAGING('records')],
      [at('/brokers', '200'), TOP_LEVEL_ARRAY],
      [at('/regions', '200'), TOP_LEVEL_ARRAY],
      [at('/branches', '200'), NO_PAGING('data')],
    ]));
  });

  test('the paging block is validated against the standard paging schema', async () => {
    const paged = (path, ...rest) => at(path, '200', 'properties', 'paging', ...rest);
    expect(await findings(failPagingStructure)).toEqual(sorted([
      [paged('/missing-limit', 'properties'), "OAR034: 'paging' must include required properties: limit"],
      [paged('/not-listed', 'required'), "OAR034: 'paging' must list as required: start, limit, links"],
      [paged('/start-string', 'properties', 'start', 'type'), "OAR034: 'paging.start' must be of type integer"],
      [paged('/paging-array', 'type'), "OAR034: 'paging' must be of type object"],
      [paged('/links-self-only', 'properties', 'links', 'properties'), "OAR034: 'paging.links' must include required properties: previous, next"],
      [paged('/href-integer', 'properties', 'links', 'properties', 'self', 'properties', 'href', 'type'), "OAR034: 'paging.links.self.href' must be of type string"],
      [paged('/nullable-paging', 'required'), "OAR034: 'paging' must list as required: links"],
      [at('/brokers/{brokerId}', '200', 'properties', 'paging', 'properties'), "OAR034: 'paging' must include required properties: limit, links"],
    ]));
  });

  test('global responses, definition aliases and allOf envelopes are followed', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      [at('/policies', '200'), NO_PAGING('data')],
      [at('/regions', '206'), NO_PAGING('data')],
      [at('/payments', '200', 'allOf', '0', 'properties', 'paging', 'required'), "OAR034: 'paging' must list as required: limit"],
      [at('/claims', '200', 'properties', 'paging', 'properties'), "OAR034: 'paging' must include required properties: start"],
    ]));
  });

  test('compliant paging through refs, allOf, x-nullable and recursive definitions reports nothing', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });
});
