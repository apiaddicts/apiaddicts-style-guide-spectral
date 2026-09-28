const { linterForRule } = require('../../helpers/utils');

let linter;

const oar047failNoTags = require('./OAR047/fail-no-tags');
const oar047failEmptyTags = require('./OAR047/fail-empty-tags');
const oar047failMissingDescription = require('./OAR047/fail-missing-description');
const oar047failDuplicateTag = require('./OAR047/fail-duplicate-tag');
const oar047failUndeclaredOperationTag = require('./OAR047/fail-undeclared-operation-tag');
const oar047failCombined = require('./OAR047/fail-combined');
const oar047failWebhooksUndeclared = require('./OAR047/fail-webhooks-undeclared');
const oar047okDocumentedTags = require('./OAR047/ok-documented-tags');
const oar047failLargeMultiTag = require('./OAR047/fail-large-multi-tag');

const KNOWN_MESSAGES = [
  'OAR047: Add tags with a short description to each one.',
  'OAR047: Remove this duplicate tag',
  'OAR047: Add a short description to this tag',
  'OAR047: This tag should be declared in the tags section of the contract',
];

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR047');
  return linter;
});

test('apiq:OAR047 no tags key at all should find 1 error', () => {
  return linter.run(oar047failNoTags).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR047: Add tags with a short description to each one.');
  });
});

test('apiq:OAR047 empty tags array should find 1 error (regression guard)', () => {
  return linter.run(oar047failEmptyTags).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR047: Add tags with a short description to each one.');
    expect(results[0].path).toEqual(['tags']);
  });
});

test('apiq:OAR047 tag missing description should find 1 error', () => {
  return linter.run(oar047failMissingDescription).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR047: Add a short description to this tag');
  });
});

test('apiq:OAR047 duplicate tag name should find 1 error on the second occurrence', () => {
  return linter.run(oar047failDuplicateTag).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR047: Remove this duplicate tag');
    expect(results[0].path).toEqual(['tags', '1', 'name']);
  });
});

test('apiq:OAR047 undeclared operation tag should find 1 error', () => {
  return linter.run(oar047failUndeclaredOperationTag).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR047: This tag should be declared in the tags section of the contract');
  });
});

test('apiq:OAR047 combined scenario should find 3 distinct issues', () => {
  return linter.run(oar047failCombined).then((results) => {
    expect(results.length).toBe(3);
    const messages = results.map((r) => r.message);
    expect(messages).toContain('OAR047: Add a short description to this tag');
    expect(messages).toContain('OAR047: Remove this duplicate tag');
    expect(messages).toContain('OAR047: This tag should be declared in the tags section of the contract');
  });
});

test('apiq:OAR047 webhooks (OpenAPI 3.1+) undeclared tag should find 1 error', () => {
  return linter.run(oar047failWebhooksUndeclared).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR047: This tag should be declared in the tags section of the contract');
    expect(results[0].path).toEqual(['webhooks', 'someHook', 'post', 'tags', '1']);
  });
});

test('apiq:OAR047 fully documented tags should find no errors', () => {
  return linter.run(oar047okDocumentedTags).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR047 large multi-tag document should find exactly the hand-counted 6 errors', () => {
  return linter.run(oar047failLargeMultiTag).then((results) => {
    expect(results.length).toBe(6);
    results.forEach((result) => {
      expect(KNOWN_MESSAGES).toContain(result.message);
    });
  });
});
