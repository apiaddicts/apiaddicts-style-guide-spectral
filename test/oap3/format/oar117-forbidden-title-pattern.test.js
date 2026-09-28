const { linterForRule } = require('../../helpers/utils');

const forbiddenTitleFn = require('../../../functions/apq-forbidden-title-pattern');

const okExample = require('./OAR117/ok-example');
const failExample = require('./OAR117/fail-example');
const okSchemaTitles31 = require('./OAR117/ok-schema-titles-31');
const failExample31 = require('./OAR117/fail-example-31');
const failExample320 = require('./OAR117/fail-example-320');
const okSummary320 = require('./OAR117/ok-summary-320');
const failRefInfo = require('./OAR117/fail-ref-info');
const failChainedRefInfo = require('./OAR117/fail-chained-ref-info');
const okNoTitle = require('./OAR117/ok-no-title');
const okNoInfo = require('./OAR117/ok-no-info');
const nonStringTitles = require('./OAR117/ok-non-string-titles');
const emptyTitle = require('./OAR117/fail-empty-title');
const blankTitle = require('./OAR117/fail-blank-title');
const multilineTitle = require('./OAR117/fail-multiline-title');
const unicodeTitle = require('./OAR117/fail-unicode-title');
const specialCharsTitle = require('./OAR117/fail-special-chars-title');
const paddedTitle = require('./OAR117/fail-padded-title');
const longTitle = require('./OAR117/fail-long-title');

const WORDS = '(?i)test|sandbox|untitled';

const linter = (forbiddenPattern) => (forbiddenPattern === undefined
  ? linterForRule('apiq:OAR117')
  : linterForRule('apiq:OAR117', { functionOptions: { 'forbidden-pattern': forbiddenPattern } }));

describe('apiq:OAR117 default pattern', () => {
  test('forbids nothing out of the box, even on a title full of forbidden-looking words', async () => {
    expect((await (await linter()).run(failExample)).length).toBe(0);
    expect((await (await linter()).run(failExample31)).length).toBe(0);
    expect((await (await linter()).run(failExample320)).length).toBe(0);
    expect((await (await linter()).run(okExample)).length).toBe(0);
  });

  test('every title shape is left alone by the default, whatever characters it carries', async () => {
    const byDefault = await linter();
    expect((await byDefault.run(multilineTitle)).length).toBe(0);
    expect((await byDefault.run(unicodeTitle)).length).toBe(0);
    expect((await byDefault.run(specialCharsTitle)).length).toBe(0);
    expect((await byDefault.run(longTitle)).length).toBe(0);
  });
});

describe('apiq:OAR117 OpenAPI 3.0', () => {
  test('a clean title reports nothing', async () => {
    expect((await (await linter(WORDS)).run(okExample)).length).toBe(0);
  });

  test('a forbidden word in the title is flagged once, with title and pattern in the message', async () => {
    const results = await (await linter(WORDS)).run(failExample);
    expect(results.length).toBe(1);
    expect(results[0].code).toBe('apiq:OAR117');
    expect(results[0].path).toEqual(['info', 'title']);
    expect(results[0].message).toBe(`OAR117: Title 'Test Payments API' matches the forbidden pattern: ${WORDS}`);
  });

  test('the match is case-insensitive only when the pattern asks for it', async () => {
    expect((await (await linter('(?i)test')).run(failExample)).length).toBe(1);
    expect((await (await linter('Test')).run(failExample)).length).toBe(1);
    expect((await (await linter('test')).run(failExample)).length).toBe(0);
  });

  test('the match is unanchored, so anchors have to be provided explicitly', async () => {
    expect((await (await linter('^Test')).run(failExample)).length).toBe(1);
    expect((await (await linter('^Payments')).run(failExample)).length).toBe(0);
    expect((await (await linter('API$')).run(failExample)).length).toBe(1);
  });

  test('an inverted lookahead expresses a "must contain" rule', async () => {
    expect((await (await linter('^(?!.*\\bAPI\\b)')).run(okExample)).length).toBe(0);
    expect((await (await linter('^(?!.*\\bPayments\\b)')).run(failExample31)).length).toBe(1);
  });
});

describe('apiq:OAR117 OpenAPI 3.1', () => {
  test('a forbidden word in the title is flagged', async () => {
    const results = await (await linter(WORDS)).run(failExample31);
    expect(results.length).toBe(1);
    expect(results[0].message).toContain('Sandbox Orders API');
  });

  test('title keywords inside schemas and parameters are never inspected', async () => {
    expect((await (await linter(WORDS)).run(okSchemaTitles31)).length).toBe(0);
  });

  test('nullable array-form types elsewhere in the document change nothing', async () => {
    expect((await (await linter('.')).run(okSchemaTitles31)).length).toBe(1);
  });
});

describe('apiq:OAR117 OpenAPI 3.2', () => {
  test('a forbidden word in the title is flagged, additionalOperations and webhooks notwithstanding', async () => {
    const results = await (await linter(WORDS)).run(failExample320);
    expect(results.length).toBe(1);
    expect(results[0].message).toContain('Untitled Catalog API');
  });

  test('info.summary and info.description are not inspected', async () => {
    expect((await (await linter(WORDS)).run(okSummary320)).length).toBe(0);
  });
});

describe('apiq:OAR117 $ref resolution', () => {
  test('a $ref-ed info object is inspected once, at the referenced definition', async () => {
    const results = await (await linter(WORDS)).run(failRefInfo);
    expect(results.length).toBe(1);
    expect(results[0].message).toContain('Test Shared Payments API');
  });

  test('a chain of $refs resolves down to the final title', async () => {
    const results = await (await linter(WORDS)).run(failChainedRefInfo);
    expect(results.length).toBe(1);
    expect(results[0].message).toContain('Test Chained Payments API');
  });
});

describe('apiq:OAR117 titles that are not inspectable strings', () => {
  test('a missing title, a missing info object and non-string titles report nothing', async () => {
    const anyTitle = await linter('.');
    expect((await anyTitle.run(okNoTitle)).length).toBe(0);
    expect((await anyTitle.run(okNoInfo)).length).toBe(0);
    expect((await anyTitle.run(nonStringTitles.numeric)).length).toBe(0);
    expect((await anyTitle.run(nonStringTitles.boolean)).length).toBe(0);
    expect((await anyTitle.run(nonStringTitles.nullTitle)).length).toBe(0);
    expect((await anyTitle.run(nonStringTitles.list)).length).toBe(0);
    expect((await anyTitle.run(nonStringTitles.map)).length).toBe(0);
  });
});

describe('apiq:OAR117 title shapes', () => {
  test('an empty title matches only an expression that accepts emptiness', async () => {
    expect((await (await linter('.')).run(emptyTitle)).length).toBe(0);
    expect((await (await linter('^$')).run(emptyTitle)).length).toBe(1);
  });

  test('a blank title is a normal string, matched by whitespace expressions', async () => {
    expect((await (await linter('^\\s+$')).run(blankTitle)).length).toBe(1);
    expect((await (await linter('^$')).run(blankTitle)).length).toBe(0);
  });

  test('a multiline title needs (?m) for ^ and (?s) for . to cross the line break', async () => {
    expect((await (await linter('(?m)^Test')).run(multilineTitle)).length).toBe(1);
    expect((await (await linter('^Test')).run(multilineTitle)).length).toBe(0);
    expect((await (await linter('(?is)billing.*test')).run(multilineTitle)).length).toBe(1);
    expect((await (await linter('(?i)billing.*test')).run(multilineTitle)).length).toBe(0);
  });

  test('accented characters and emoji are matched like any other character', async () => {
    expect((await (await linter('(?i)facturación')).run(unicodeTitle)).length).toBe(1);
    expect((await (await linter('(?u)\\u{1F600}')).run(unicodeTitle)).length).toBe(1);
    expect((await (await linter('(?i)facturacion')).run(unicodeTitle)).length).toBe(0);
  });

  test('regex metacharacters in the title are matched literally when escaped', async () => {
    expect((await (await linter('\\[beta\\]')).run(specialCharsTitle)).length).toBe(1);
    expect((await (await linter('\\{draft\\}')).run(specialCharsTitle)).length).toBe(1);
    expect((await (await linter('v2\\.0')).run(specialCharsTitle)).length).toBe(1);
  });

  test('surrounding whitespace is not trimmed away before matching', async () => {
    expect((await (await linter('^Test')).run(paddedTitle)).length).toBe(0);
    expect((await (await linter('^\\s+Test')).run(paddedTitle)).length).toBe(1);
  });

  test('a very long title is matched without blowing up', async () => {
    const results = await (await linter('(?i)test$')).run(longTitle);
    expect(results.length).toBe(1);
  });
});

describe('apiq:OAR117 misconfigured patterns never raise a finding', () => {
  test('empty, blank-after-flags, non-string and invalid patterns are inert', async () => {
    expect((await (await linter('')).run(failExample)).length).toBe(0);
    expect((await (await linter('(?i)')).run(failExample)).length).toBe(0);
    expect((await (await linter(null)).run(failExample)).length).toBe(0);
    expect((await (await linter(42)).run(failExample)).length).toBe(0);
    expect((await (await linter(['test'])).run(failExample)).length).toBe(0);
    expect((await (await linter('([unclosed')).run(failExample)).length).toBe(0);
    expect((await (await linter('a{2,1}')).run(failExample)).length).toBe(0);
  });
});

describe('apiq:OAR117 function guards (direct)', () => {
  const ctx = { path: ['info', 'title'] };

  test('non-string targets return []', () => {
    expect(forbiddenTitleFn(123, { 'forbidden-pattern': '.' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn(null, { 'forbidden-pattern': '.' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn(undefined, { 'forbidden-pattern': '.' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn(true, { 'forbidden-pattern': '.' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn(['Test'], { 'forbidden-pattern': '.' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn({ value: 'Test' }, { 'forbidden-pattern': '.' }, ctx)).toEqual([]);
  });

  test('missing options object and missing option return []', () => {
    expect(forbiddenTitleFn('Test API', undefined, ctx)).toEqual([]);
    expect(forbiddenTitleFn('Test API', null, ctx)).toEqual([]);
    expect(forbiddenTitleFn('Test API', {}, ctx)).toEqual([]);
    expect(forbiddenTitleFn('Test API', { pattern: 'Test' }, ctx)).toEqual([]);
  });

  test('the default (?!) matches no title at all', () => {
    const options = { 'forbidden-pattern': '(?!)' };
    expect(forbiddenTitleFn('Test API', options, ctx)).toEqual([]);
    expect(forbiddenTitleFn('', options, ctx)).toEqual([]);
    expect(forbiddenTitleFn('(?!)', options, ctx)).toEqual([]);
  });

  test('inline flag groups are translated to JavaScript flags', () => {
    expect(forbiddenTitleFn('test api', { 'forbidden-pattern': '(?i)TEST' }, ctx)).toHaveLength(1);
    expect(forbiddenTitleFn('test api', { 'forbidden-pattern': '(?I)TEST' }, ctx)).toHaveLength(1);
    expect(forbiddenTitleFn('a\nTest', { 'forbidden-pattern': '(?m)^Test' }, ctx)).toHaveLength(1);
    expect(forbiddenTitleFn('a\nTest', { 'forbidden-pattern': '(?s)a.Test' }, ctx)).toHaveLength(1);
    expect(forbiddenTitleFn('a\ntest', { 'forbidden-pattern': '(?ims)A.TEST' }, ctx)).toHaveLength(1);
    expect(forbiddenTitleFn('😀', { 'forbidden-pattern': '(?u)\\u{1F600}' }, ctx)).toHaveLength(1);
  });

  test('stateful and unknown inline flags fall through to a literal, invalid expression', () => {
    expect(forbiddenTitleFn('Test API', { 'forbidden-pattern': '(?g)Test' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn('Test API', { 'forbidden-pattern': '(?y)Test' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn('Test API', { 'forbidden-pattern': '(?x)Test' }, ctx)).toEqual([]);
    expect(forbiddenTitleFn('Test API', { 'forbidden-pattern': '(?ig)Test' }, ctx)).toEqual([]);
  });

  test('an inline flag group is only honoured at the start of the pattern', () => {
    expect(forbiddenTitleFn('test api', { 'forbidden-pattern': 'TEST(?i)' }, ctx)).toEqual([]);
  });

  test('repeated calls with the same options are stable, so no global flag leaks in', () => {
    const options = { 'forbidden-pattern': '(?i)test' };
    expect(forbiddenTitleFn('Test API', options, ctx)).toHaveLength(1);
    expect(forbiddenTitleFn('Test API', options, ctx)).toHaveLength(1);
    expect(forbiddenTitleFn('Test API', options, ctx)).toHaveLength(1);
  });

  test('the reported path falls back to [] when the context carries none', () => {
    expect(forbiddenTitleFn('Test API', { 'forbidden-pattern': 'Test' }, {})[0].path).toEqual([]);
    expect(forbiddenTitleFn('Test API', { 'forbidden-pattern': 'Test' }, undefined)[0].path).toEqual([]);
  });
});
