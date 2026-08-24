const { linterForRule } = require('../../helpers/utils');

const queryOptionalFn = require('../../../functions/apq-query-params-optional');

const failCases = {
  'fail-example': [require('./OAR060/fail-example'), 1],
  'fail-multiple-verbs': [require('./OAR060/fail-multiple-verbs'), 5],
  'fail-path-level': [require('./OAR060/fail-path-level'), 1],
  'fail-components': [require('./OAR060/fail-components'), 1],
  'fail-mixed': [require('./OAR060/fail-mixed'), 2],
};

const okCases = {
  'ok-example': require('./OAR060/ok-example'),
  'ok-no-required': require('./OAR060/ok-no-required'),
  'ok-non-query': require('./OAR060/ok-non-query'),
  'ok-excluded': require('./OAR060/ok-excluded'),
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

describe('apiq:OAR060 function guards (direct)', () => {
  const at = (p) => ({ path: p });
  test('defaults options when omitted and flags required:true', () => {
    expect(queryOptionalFn(true, undefined, at(['paths', '/x', 'get', 'parameters', 0, 'required']))).toHaveLength(1);
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
});
