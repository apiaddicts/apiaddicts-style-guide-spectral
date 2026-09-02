const { linterForRule } = require('../../helpers/utils');

const okDefault = require('./OAR116/ok-example');
const okVersioned = require('./OAR116/ok-versioned');
const failVersioned = require('./OAR116/fail-example');
const failCasing = require('./OAR116/fail-casing');

test('apiq:OAR116 (OpenAPI 2) default ^/ finds no errors on well-formed paths', async () => {
  const linter = await linterForRule('apiq:OAR116');
  expect((await linter.run(okDefault)).length).toBe(0);
});

test('apiq:OAR116 (OpenAPI 2) versioning pattern ^/v[0-9]+ passes versioned paths', async () => {
  const linter = await linterForRule('apiq:OAR116', { functionOptions: { pattern: '^/v[0-9]+' } });
  expect((await linter.run(okVersioned)).length).toBe(0);
});

test('apiq:OAR116 (OpenAPI 2) versioning pattern flags a non-versioned path', async () => {
  const linter = await linterForRule('apiq:OAR116', { functionOptions: { pattern: '^/v[0-9]+' } });
  const results = await linter.run(failVersioned);
  expect(results.length).toBe(1);
  expect(results[0].message).toContain('^/v[0-9]+');
});

test('apiq:OAR116 (OpenAPI 2) lowercase pattern flags camelCase and snake_case paths', async () => {
  const linter = await linterForRule('apiq:OAR116', { functionOptions: { pattern: '^/[a-z0-9/{}-]+$' } });
  expect((await linter.run(failCasing)).length).toBe(2);
});
