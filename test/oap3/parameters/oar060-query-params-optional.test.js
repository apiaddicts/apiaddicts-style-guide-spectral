const { linterForRule } = require('../../helpers/utils');

const queryOptionalFn = require('../../../functions/apq-query-params-optional');

const failCases = {
  'fail-example': [require('./OAR060/fail-example'), 1],
  'fail-multiple-verbs': [require('./OAR060/fail-multiple-verbs'), 5],
  'fail-path-level': [require('./OAR060/fail-path-level'), 1],
  'fail-components': [require('./OAR060/fail-components'), 1],
  'fail-mixed': [require('./OAR060/fail-mixed'), 2],
  'fail-ref-mixed-paths': [require('./OAR060/fail-ref-mixed-paths'), 2],
};

const okCases = {
  'ok-example': require('./OAR060/ok-example'),
  'ok-no-required': require('./OAR060/ok-no-required'),
  'ok-non-query': require('./OAR060/ok-non-query'),
  'ok-excluded': require('./OAR060/ok-excluded'),
  'ok-ref-excluded': require('./OAR060/ok-ref-excluded'),
};

let linter;
beforeAll(async () => {
  linter = await linterForRule('apiq:OAR060');
  return linter;
});

describe('apiq:OAR060 fail examples', () => {
  Object.entries(failCases).forEach(([name, [doc, count]]) => {
    test(`${name} -> ${count} issue(s)`, () => linter.run(doc).then((r) => expect(r.length).toBe(count)));
  });
});

describe('apiq:OAR060 ok examples', () => {
  Object.entries(okCases).forEach(([name, doc]) => {
    test(`${name} -> 0 issues`, () => linter.run(doc).then((r) => expect(r.length).toBe(0)));
  });
});

test('apiq:OAR060 honors a custom path-exclusions list', async () => {
  const custom = await linterForRule('apiq:OAR060', { functionOptions: { 'path-exclusions': '/pets' } });
  const results = await custom.run(require('./OAR060/fail-example'));
  expect(results.length).toBe(0);
});

test('apiq:OAR060 keeps a shared definition in scope once a non-excluded path uses it', async () => {
  const custom = await linterForRule('apiq:OAR060', { functionOptions: { 'path-exclusions': '/status,/pets' } });
  const results = await custom.run(require('./OAR060/fail-ref-mixed-paths'));
  // With both consumers excluded, SharedByBoth and the ChainedAlias hop are both suppressed.
  expect(results.length).toBe(0);
});

test('apiq:OAR060 still reports an external $ref at its use site', async () => {
  const linterOwn = await linterForRule('apiq:OAR060');
  const results = await linterOwn.run(require('./OAR060/fail-ref-external'));
  expect(results.filter((r) => r.code === 'apiq:OAR060').length).toBe(1);
});

describe('apiq:OAR060 function guards (direct)', () => {
  const at = (p, data) => ({ path: p, document: data === undefined ? undefined : { data } });
  test('defaults options when omitted and flags required:true', () => {
    expect(queryOptionalFn(true, undefined, at(['paths', '/x', 'get', 'parameters', 0, 'required']))).toHaveLength(1);
  });
  test('defaults context when omitted', () => {
    expect(queryOptionalFn(true)).toHaveLength(1);
    expect(queryOptionalFn(false)).toEqual([]);
  });
  test('treats string "true" as required, and false/absent as optional', () => {
    expect(queryOptionalFn('true', {}, at(['paths', '/x']))).toHaveLength(1);
    expect(queryOptionalFn(false, {}, at(['paths', '/x']))).toEqual([]);
    expect(queryOptionalFn(undefined, {}, at(['paths', '/x']))).toEqual([]);
  });
  test('exact-match exclusion skips /status but not /status/health', () => {
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['paths', '/status', 'get', 'parameters', 0, 'required']))).toEqual([]);
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['paths', '/status/health', 'get', 'parameters', 0, 'required']))).toHaveLength(1);
  });
  test('an unreferenced shared definition is never excluded', () => {
    const data = { components: { parameters: { Shared: { in: 'query', name: 'q', required: true } } } };
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['components', 'parameters', 'Shared', 'required'], data))).toHaveLength(1);
  });
  test('a percent-encoded / tilde-escaped pointer still matches its definition', () => {
    const data = {
      paths: { '/status': { get: { parameters: [{ $ref: '#/components/parameters/od~1d%20one' }] } } },
      components: { parameters: { 'od/d one': { in: 'query', name: 'q', required: true } } },
    };
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['components', 'parameters', 'od/d one', 'required'], data))).toEqual([]);
  });
  test('a $ref cycle in the document terminates instead of hanging', () => {
    const data = {
      paths: {
        '/status': {
          get: {
            parameters: [
              { $ref: '#/components/parameters/A' },
              { $ref: '#/components/parameters/Terminal' },
            ],
          },
        },
      },
      components: {
        parameters: {
          A: { $ref: '#/components/parameters/B' },
          B: { $ref: '#/components/parameters/A' },
          Terminal: { in: 'query', name: 'q', required: true },
        },
      },
    };
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['components', 'parameters', 'Terminal', 'required'], data))).toEqual([]);
  });
  test('a $ref that is not a shared parameter definition is still evaluated at its use site', () => {
    const data = { paths: { '/pets': { get: { parameters: [{ $ref: '#/components/schemas/NotAParam' }] } } } };
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['paths', '/pets', 'get', 'parameters', 0, 'required'], data))).toHaveLength(1);
  });
  test('a shared definition is never excluded when the source document is unavailable', () => {
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['components', 'parameters', 'Shared', 'required']))).toHaveLength(1);
  });
  test('a match outside the two shared-definition containers is left alone', () => {
    const data = { webhooks: { onEvent: { get: { parameters: [{ in: 'query', name: 'q', required: true }] } } } };
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['webhooks', 'onEvent', 'get', 'parameters', 0, 'required'], data))).toHaveLength(1);
  });
  test('external, unresolvable and malformed refs do not derail usage collection', () => {
    const data = {
      paths: {
        '/status': {
          get: {
            parameters: [
              { $ref: './common.yaml#/components/parameters/External' },
              { $ref: '#/components/parameters/Missing' },
              { $ref: '#/components/parameters/%zz' },
              { $ref: '#/components/parameters/Shared' },
            ],
          },
        },
      },
      components: { parameters: { Shared: { in: 'query', name: 'q', required: true } } },
    };
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['components', 'parameters', 'Shared', 'required'], data))).toEqual([]);
  });
  test('ignores malformed paths, path items and parameter lists while collecting usages', () => {
    const data = {
      paths: { '/status': null, '/a': { get: null, parameters: 'nope' }, '/b': { post: { parameters: [null, 42] } } },
      components: { parameters: { Shared: { in: 'query', name: 'q', required: true } } },
    };
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['components', 'parameters', 'Shared', 'required'], data))).toHaveLength(1);
    expect(queryOptionalFn(true, { 'path-exclusions': '/status' }, at(['components', 'parameters', 'Shared', 'required'], { paths: 'nope' }))).toHaveLength(1);
  });
});
