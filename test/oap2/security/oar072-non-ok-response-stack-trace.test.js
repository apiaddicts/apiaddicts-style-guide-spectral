const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

const nonOkResponseStackTrace = require('../../../functions/apq-non-ok-response-stack-trace');

const failExample = require('./OAR072/fail-example');
const okExample = require('./OAR072/ok-example');
const failRefs = require('./OAR072/fail-refs');
const okRefs = require('./OAR072/ok-refs');
const failLarge = require('./OAR072/fail-large-multi-path');

const RULE = 'apiq:OAR072';
const message = (name) => `OAR072: Responses other than 200 must not include the stack trace property '${name}'.`;
const at = (path, name) => [[...path.split(' '), name], message(name)];
const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

let linter;
const findings = async (document) => sorted((await linter.run(document)).filter((r) => r.code === RULE).map((r) => [r.path, r.message]));

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR072 - Swagger 2.0', () => {
  test('flags every stack trace property of a response other than 200 as an error, whatever its casing or separators', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      at('paths /claims get responses 400 schema properties', 'stackTrace'),
      at('responses ServerError schema properties', 'exceptionStackTrace'),
      at('paths /claims post responses 201 schema properties', 'stacktrace'),
      at('definitions ErrorResponse properties', 'stack_trace'),
      at('paths /claims post responses 422 schema properties error properties details items properties', 'stack-trace'),
      at('paths /claims post responses default schema allOf 1 properties', 'STACK_TRACE'),
      at('paths /claims/{claimId} head responses 404 schema properties', 'Stack_Trace'),
      at('paths /claims/{claimId} options responses 405 schema additionalProperties properties', 'StackTrace'),
      at('definitions MaintenanceError properties', 'stack.trace'),
    ]));
  });

  test('accepts stack traces in 200 responses, near-miss names, examples, extensions and non 2.0 methods', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('follows shared responses, chained and circular definitions, pointers into properties and $ref path items, once on each definition', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      at('definitions ResponseEntity«ErrorDTO» properties', 'exceptionStackTrace'),
      [['definitions', 'Share Error', 'properties', 'STACK_TRACE'], message('STACK_TRACE')],
      at('paths /folders/{folderId}/shares post responses 500 schema properties', 'stackTrace'),
      at('definitions ProblemBase properties', 'stackTrace'),
      at('definitions TreeNode properties', 'nodeStackTrace'),
      at('definitions NotFoundCore properties', 'stack_trace'),
      at('definitions Envelope properties error properties', 'Stack-Trace'),
      at('x-path-templates Documents get responses 500 schema properties', 'storageStackTrace'),
    ]));
  });

  test('places the findings on the same keys when the document has a source', async () => {
    const results = (await linter.run(new Document(JSON.stringify(failRefs, null, 2), Parsers.Json, 'vault.json'))).filter((r) => r.code === RULE);
    expect(sorted(results.map((r) => [r.path, r.message]))).toEqual(await findings(failRefs));
  });

  test('ignores dangling, circular and unreadable external models, keywords next to $ref, unused responses and models used only by 200', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('reports a shared error model once and every inline stack trace on a large multi-path spec', async () => {
    const { 'x-expected-inline': inline, ...document } = failLarge;
    expect(Object.keys(document.paths).length).toBe(240);
    expect(await findings(document)).toEqual(sorted([
      at('definitions ErrorEnvelope properties errors items properties', 'errorStackTrace'),
      ...inline.map(([path, name]) => [['paths', path, 'get', 'responses', '500', 'schema', 'properties', name], message(name)]),
    ]));
  });
});

describe('apq-non-ok-response-stack-trace - unusable input', () => {
  const context = { rule: { name: RULE } };

  test.each([
    ['null', null],
    ['a string', 'swagger: "2.0"'],
    ['an array', []],
    ['no paths', { swagger: '2.0' }],
    ['paths as an array', { swagger: '2.0', paths: [] }],
    ['no version', { paths: { '/a': { get: { responses: { 400: { schema: { properties: { stackTrace: {} } } } } } } } }],
  ])('returns no results for %s', (_label, root) => {
    expect(nonOkResponseStackTrace(root, null, context)).toEqual([]);
  });

  test('skips null path items, operations, responses and schemas', () => {
    const root = {
      swagger: '2.0',
      paths: {
        '/a': null,
        '/b': { get: null, post: { responses: null }, put: { responses: [] } },
        '/c': { get: { responses: { 400: null, 401: [], 404: { schema: null }, 409: { schema: { properties: null } }, 500: { schema: { properties: [] } } } } },
      },
    };
    expect(nonOkResponseStackTrace(root, null, context)).toEqual([]);
  });

  test('follows a definition name with a literal percent sign that is not a valid escape', () => {
    const root = {
      swagger: '2.0',
      paths: { '/a': { get: { responses: { 429: { schema: { $ref: '#/definitions/Rate%Limit' } } } } } },
      definitions: { 'Rate%Limit': { type: 'object', properties: { stackTrace: { type: 'string' } } } },
    };
    expect(nonOkResponseStackTrace(root, null, context)).toEqual([
      { message: message('stackTrace'), path: ['definitions', 'Rate%Limit', 'properties', 'stackTrace'] },
    ]);
  });

  test('uses OAR072 in the message when the rule name is not available', () => {
    const root = { swagger: '2.0', paths: { '/a': { get: { responses: { 400: { schema: { properties: { stackTrace: { type: 'string' } } } } } } } } };
    expect(nonOkResponseStackTrace(root, null, undefined)).toEqual([
      { message: message('stackTrace'), path: ['paths', '/a', 'get', 'responses', '400', 'schema', 'properties', 'stackTrace'] },
    ]);
  });
});
