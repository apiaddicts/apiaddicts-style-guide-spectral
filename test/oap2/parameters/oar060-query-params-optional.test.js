const { linterForRule } = require('../../helpers/utils');

const failCases = {
  'fail-example': [require('./OAR060/fail-example'), 1],
  'fail-multiple-verbs': [require('./OAR060/fail-multiple-verbs'), 5],
  'fail-path-level': [require('./OAR060/fail-path-level'), 1],
  'fail-toplevel-param': [require('./OAR060/fail-toplevel-param'), 1],
  'fail-mixed': [require('./OAR060/fail-mixed'), 2],
  'fail-ref-mixed-paths': [require('./OAR060/fail-ref-mixed-paths'), 1],
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

describe('apiq:OAR060 (OpenAPI 2) fail examples', () => {
  Object.entries(failCases).forEach(([name, [doc, count]]) => {
    test(`${name} -> ${count} issue(s)`, () => linter.run(doc).then((r) => expect(r.length).toBe(count)));
  });
});

describe('apiq:OAR060 (OpenAPI 2) ok examples', () => {
  Object.entries(okCases).forEach(([name, doc]) => {
    test(`${name} -> 0 issues`, () => linter.run(doc).then((r) => expect(r.length).toBe(0)));
  });
});

test('apiq:OAR060 (OpenAPI 2) honors a custom path-exclusions list', async () => {
  const custom = await linterForRule('apiq:OAR060', { functionOptions: { 'path-exclusions': '/pets' } });
  const results = await custom.run(require('./OAR060/fail-example'));
  expect(results.length).toBe(0);
});
