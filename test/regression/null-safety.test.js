const { fullLinterForRuleset } = require('../helpers/utils');

// Regression guard for the "Cannot read properties of null (reading 'type')" crash.
//
// Recursive-descent givens ($..[?(@.type...)]) visit EVERY node in the document,
// including null values nested inside schemas (enum members, items, example,
// default...). Evaluating @.type / @.properties on such a null throws, and a single
// throwing given aborts the whole ruleset run. The fix adds an `@ &&` guard to every
// affected given (OAR016/037/052/074/075/076/081/082). This spec places nulls exactly
// where $.. reaches them so the ruleset must NOT crash while linting it.
const specWithNulls = [
  'openapi: 3.0.0',
  'info: { title: null-safety, version: "1.0.0" }',
  'paths:',
  '  /things:',
  '    get:',
  '      parameters:',
  '        - name: id',
  '          in: query',
  '          schema: { type: integer }',
  '      responses:',
  '        "200":',
  '          description: ok',
  '          content:',
  '            application/json:',
  '              schema:',
  '                type: object',
  '                properties:',
  '                  a: { type: string, enum: [null] }',      // null as an array member
  '                  b: { type: number }',
  '                  c: { type: array, items: null }',        // null schema value
  '                  d: { type: integer, example: null }',    // null example
  '                  e: { type: string, default: null }',     // null default
].join('\n');

describe('null-safety regression (recursive-descent givens must not crash on null nodes)', () => {
  test.each([
    ['apq-spectral.yaml', './apq-spectral.yaml'],
    ['apq-spectral.json', './apq-spectral.json'],
  ])('%s runs without throwing on a spec containing null nodes', async (_label, file) => {
    const linter = await fullLinterForRuleset(file);
    const results = await linter.run(specWithNulls);
    // The contract is simply: run() resolves (no unguarded null dereference).
    expect(Array.isArray(results)).toBe(true);
  });
});
