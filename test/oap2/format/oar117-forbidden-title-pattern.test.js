const { linterForRule } = require('../../helpers/utils');

const okExample = require('./OAR117/ok-example');
const failExample = require('./OAR117/fail-example');
const okDefinitionTitles = require('./OAR117/ok-definition-titles');
const failRefInfo = require('./OAR117/fail-ref-info');
const okNoTitle = require('./OAR117/ok-no-title');
const nonStringTitles = require('./OAR117/ok-non-string-titles');

const WORDS = '(?i)test|sandbox|untitled';

const linter = (forbiddenPattern) => (forbiddenPattern === undefined
  ? linterForRule('apiq:OAR117')
  : linterForRule('apiq:OAR117', { functionOptions: { 'forbidden-pattern': forbiddenPattern } }));

test('apiq:OAR117 (OpenAPI 2) forbids nothing with the default pattern', async () => {
  expect((await (await linter()).run(failExample)).length).toBe(0);
});

test('apiq:OAR117 (OpenAPI 2) a clean title reports nothing', async () => {
  expect((await (await linter(WORDS)).run(okExample)).length).toBe(0);
});

test('apiq:OAR117 (OpenAPI 2) a forbidden word in the title is flagged once', async () => {
  const results = await (await linter(WORDS)).run(failExample);
  expect(results.length).toBe(1);
  expect(results[0].code).toBe('apiq:OAR117');
  expect(results[0].path).toEqual(['info', 'title']);
  expect(results[0].message).toBe(`OAR117: Title 'Test Legacy Billing API' matches the forbidden pattern: ${WORDS}`);
});

test('apiq:OAR117 (OpenAPI 2) title keywords inside definitions are never inspected', async () => {
  expect((await (await linter(WORDS)).run(okDefinitionTitles)).length).toBe(0);
  expect((await (await linter('.')).run(okDefinitionTitles)).length).toBe(1);
});

test('apiq:OAR117 (OpenAPI 2) a $ref-ed info object is inspected at the referenced definition', async () => {
  const results = await (await linter(WORDS)).run(failRefInfo);
  expect(results.length).toBe(1);
  expect(results[0].message).toContain('Test Shared Billing API');
});

test('apiq:OAR117 (OpenAPI 2) a missing or non-string title reports nothing', async () => {
  const anyTitle = await linter('.');
  expect((await anyTitle.run(okNoTitle)).length).toBe(0);
  expect((await anyTitle.run(nonStringTitles.numeric)).length).toBe(0);
  expect((await anyTitle.run(nonStringTitles.nullTitle)).length).toBe(0);
  expect((await anyTitle.run(nonStringTitles.list)).length).toBe(0);
});

test('apiq:OAR117 (OpenAPI 2) anchors, case sensitivity and inverted lookaheads behave as in 3.x', async () => {
  expect((await (await linter('^Test')).run(failExample)).length).toBe(1);
  expect((await (await linter('^Billing')).run(failExample)).length).toBe(0);
  expect((await (await linter('test')).run(failExample)).length).toBe(0);
  expect((await (await linter('^(?!.*\\bAPI\\b)')).run(okExample)).length).toBe(0);
  expect((await (await linter('^(?!.*\\bLegacy\\b)')).run(okExample)).length).toBe(1);
});

test('apiq:OAR117 (OpenAPI 2) misconfigured patterns are inert', async () => {
  expect((await (await linter('')).run(failExample)).length).toBe(0);
  expect((await (await linter('(?i)')).run(failExample)).length).toBe(0);
  expect((await (await linter('([unclosed')).run(failExample)).length).toBe(0);
  expect((await (await linter(42)).run(failExample)).length).toBe(0);
});
