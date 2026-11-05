const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

const nonOkResponseStackTrace = require('../../../functions/apq-non-ok-response-stack-trace');

const failExample = require('./OAR072/fail-example');
const okExample = require('./OAR072/ok-example');
const failRefs = require('./OAR072/fail-refs');
const failRefs31 = require('./OAR072/fail-refs-31');
const okRefs = require('./OAR072/ok-refs');
const failExample31 = require('./OAR072/fail-example-31');
const okExample31 = require('./OAR072/ok-example-31');
const failExample320 = require('./OAR072/fail-example-320');
const okExample320 = require('./OAR072/ok-example-320');
const failReported = require('./OAR072/fail-reported-standard-error');
const failLarge = require('./OAR072/fail-large-multi-path');

const RULE = 'apiq:OAR072';
const message = (name) => `OAR072: Responses other than 200 must not include the stack trace property '${name}'.`;
const media = (path, type, ...rest) => {
  const [pathKey, ...operation] = path.split(' ');
  return [['paths', pathKey, ...operation, 'content', type, ...rest], message(rest[rest.length - 1])];
};
const located = (path, name) => [[...path.split(' '), name], message(name)];
const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

let linter;
const findings = async (document) => sorted((await linter.run(document)).filter((r) => r.code === RULE).map((r) => [r.path, r.message]));
const asDocument = (fixture, name) => new Document(JSON.stringify(fixture, null, 2), Parsers.Json, name);

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR072 - reported case', () => {
  test('stack_trace in the shared standardErrorResponse is reported once, on its definition', async () => {
    const results = (await linter.run(asDocument(failReported, 'onboarding.json'))).filter((r) => r.code === RULE);
    expect(results.map((r) => [r.path, r.message, r.severity])).toEqual([
      [['components', 'schemas', 'standardErrorResponse', 'properties', 'stack_trace'], message('stack_trace'), 0],
    ]);
  });
});

describe('apiq:OAR072 - OpenAPI 3.0', () => {
  test('flags stack traces in every media type, range and default response, operation and composition other than 200', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      media('/payments get responses 400', 'application/problem+json', 'schema', 'properties', 'stackTrace'),
      located('components schemas Problem properties', 'stack_trace'),
      media('/payments get responses 5XX', 'application/json', 'schema', 'properties', 'STACKTRACE'),
      media('/payments post responses 202', 'application/json', 'schema', 'properties', 'stackTrace'),
      media('/payments post responses 409', 'application/xml', 'schema', 'properties', 'StackTrace'),
      located('components schemas ValidationError properties errors items properties', 'stack-trace'),
      media('/payments post responses 429', 'application/json', 'schema', 'anyOf', '1', 'properties', 'exceptionStackTrace'),
      media('/payments post responses default', 'application/json', 'schema', 'allOf', '1', 'properties', 'debug', 'properties', 'Stack Trace'),
      media('/payments/{paymentId} trace responses 500', 'message/http', 'schema', 'properties', 'stacktrace'),
      media('/payments/{paymentId} delete responses 503', 'application/json', 'schema', 'properties', 'stack_trace'),
    ]));
  });

  test('accepts callbacks, request bodies, parameters, headers, links, examples, not, extensions and non 3.0 fields', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows chained component responses, allOf, circular schemas, pointers into properties and $ref path items, once on each definition', async () => {
    const expected = sorted([
      located('components schemas ProblemBase properties', 'stackTrace'),
      located('components schemas Category properties', 'stack_trace'),
      located('components schemas Envelope properties error properties', 'STACK-TRACE'),
      located('x-path-items Reviews get responses 500 content application/json schema properties', 'indexStackTrace'),
    ]);
    expect(await findings(failRefs)).toEqual(expected);
    const results = (await linter.run(asDocument(failRefs, 'catalog.json'))).filter((r) => r.code === RULE);
    expect(sorted(results.map((r) => [r.path, r.message]))).toEqual(expected);
  });

  test('ignores dangling, circular and unreadable external schemas, keywords next to $ref, request bodies and models used only by 200', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('reports a shared problem once and every inline stack trace on a large multi-path spec', async () => {
    const { 'x-expected-inline': inline, ...document } = failLarge;
    expect(Object.keys(document.paths).length).toBe(270);
    expect(await findings(document)).toEqual(sorted([
      located('components schemas Problem properties errors items properties', 'causeStackTrace'),
      ...inline.map(([path, name]) => media(`${path} patch responses 422`, 'application/json', 'schema', 'allOf', '1', 'properties', name)),
    ]));
  });
});

describe('apiq:OAR072 - OpenAPI 3.1', () => {
  test('flags nullable types, true schemas and every subschema that declares members, but not false schemas or webhooks', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      media('/shipments get responses 400', 'application/json', 'schema', 'properties', 'stackTrace'),
      media('/shipments get responses 400', 'application/json', 'schema', 'properties', 'rawStackTrace'),
      media('/shipments get responses 422', 'application/json', 'schema', 'items', 'properties', 'StackTrace'),
      media('/shipments get responses 500', 'application/json', 'schema', 'prefixItems', '1', 'properties', 'stack-trace'),
      media('/shipments post responses 409', 'application/json', 'schema', 'then', 'properties', 'debugStackTrace'),
      media('/shipments post responses 409', 'application/json', 'schema', 'else', 'properties', 'STACK_TRACE'),
      media('/shipments post responses 409', 'application/json', 'schema', 'dependentSchemas', 'debug', 'properties', 'Stack.Trace'),
      media('/shipments post responses 415', 'application/json', 'schema', 'patternProperties', '^x-', 'properties', 'stackTraceLines'),
      media('/shipments post responses 415', 'application/json', 'schema', 'unevaluatedProperties', 'properties', 'stacktrace'),
      media('/shipments post responses 429', 'application/json', 'schema', 'contains', 'properties', 'exceptionStackTrace'),
      located('components schemas Problem $defs Debug properties', 'Stack_Trace'),
      located('components pathItems ShipmentEvents get responses 503 content application/json schema properties', 'eventStoreStackTrace'),
    ]));
  });

  test('places $defs and components.pathItems findings on their definitions when the document has a source', async () => {
    const results = (await linter.run(asDocument(failExample31, 'logistics.json'))).filter((r) => r.code === RULE);
    expect(sorted(results.map((r) => [r.path, r.message]))).toEqual(await findings(failExample31));
  });

  test('evaluates keywords next to $ref, percent-encoded pointers and properties defined by reference, each on its own key', async () => {
    const expected = sorted([
      located('paths /invoices get responses 400 content application/json schema properties', 'stack_trace'),
      located('components schemas Problem $defs Debug properties', 'StackTrace'),
      located('components schemas ConflictProblem properties', 'conflict-stack-trace'),
      located('components schemas ConflictBase properties', 'STACKTRACE'),
      located('paths /invoices get responses 500 content application/json schema properties', 'stackTrace'),
    ]);
    expect(await findings(failRefs31)).toEqual(expected);
    const results = (await linter.run(asDocument(failRefs31, 'billing.json'))).filter((r) => r.code === RULE);
    expect(sorted(results.map((r) => [r.path, r.message]))).toEqual(expected);
  });

  test('accepts false schemas, if and not conditions, propertyNames, examples, look-alike names and webhooks', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });
});

describe('apiq:OAR072 - OpenAPI 3.2', () => {
  test('flags query, additionalOperations, itemSchema and components.mediaTypes', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      media('/quotes query responses 400', 'application/json', 'schema', 'properties', 'stackTrace'),
      media('/quotes get responses 503', 'text/event-stream', 'itemSchema', 'properties', 'data', 'properties', 'stack-trace'),
      located('components mediaTypes Problem schema properties', 'StackTrace'),
      media('/quotes additionalOperations PURGE responses 500', 'application/json', 'schema', 'properties', 'stack_trace'),
    ]));
    const results = (await linter.run(asDocument(failExample320, 'markets.json'))).filter((r) => r.code === RULE);
    expect(results.map((r) => r.path.join(' '))).toContain('components mediaTypes Problem schema properties StackTrace');
  });

  test('accepts 200 responses of every operation kind, false schemas, unused media types and webhooks', async () => {
    expect(await findings(okExample320)).toEqual([]);
  });
});

describe('apq-non-ok-response-stack-trace - unusable input', () => {
  const context = { rule: { name: RULE } };

  test.each([
    ['a non-string version', { openapi: 3.1, paths: { '/a': { get: { responses: { 400: { content: { 'application/json': { schema: { properties: { stackTrace: {} } } } } } } } } } }],
  ])('treats %s as OpenAPI 3.x', (_label, root) => {
    expect(nonOkResponseStackTrace(root, null, context)).toHaveLength(1);
  });

  test('skips null content, media types, schemas and subschemas', () => {
    const root = {
      openapi: '3.2.0',
      paths: {
        '/a': {
          get: {
            responses: {
              400: { content: null },
              401: { content: { 'application/json': null, 'text/plain': [] } },
              404: { content: { 'application/json': { schema: { allOf: null, items: [null], prefixItems: {}, patternProperties: [], dependentSchemas: null, then: 1 } } } },
            },
          },
          additionalOperations: { PURGE: null, LINK: [] },
        },
        '/b': { additionalOperations: [] },
      },
    };
    expect(nonOkResponseStackTrace(root, null, context)).toEqual([]);
  });
});
