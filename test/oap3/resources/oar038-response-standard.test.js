const { linterForRule } = require('../../helpers/utils');

let linter;
let linterCustomDataProperty;

const oar038fail = require('./OAR038/fail-example');
const oar038ok = require('./OAR038/ok-example');
const oar038NoSchemaAtAll = require('./OAR038/no-schema-at-all');
const oar038EmptyProperties = require('./OAR038/empty-properties');
const oar038AllOfComposed = require('./OAR038/allof-composed');
const oar038AllOfCircularSafe = require('./OAR038/allof-circular-safe');
const oar038OneOfNotMerged = require('./OAR038/oneof-not-merged');
const oar038MultipleMediaTypes = require('./OAR038/multiple-media-types');
const oar038CustomDataProperty = require('./OAR038/custom-data-property');
const oar038NullableArrayType = require('./OAR038/nullable-array-type');
const oar038ErrorOnly = require('./OAR038/error-only');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR038');
  linterCustomDataProperty = await linterForRule('apiq:OAR038', {
    functionOptions: { 'data-property': 'result' },
  });
});

test('apiq:OAR038 should find errors', () => {
  return linter.run(oar038fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR038 should find no errors', () => {
  return linter.run(oar038ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

describe('apiq:OAR038 fail scenarios', () => {
  test.each([
    ['201 with no schema/content at all', oar038NoSchemaAtAll, 1],
    ['201 schema with empty properties object', oar038EmptyProperties, 1],
    ['oneOf branches are not merged (documented non-support)', oar038OneOfNotMerged, 1],
    ['second media type on the same 201 has an invalid property name', oar038MultipleMediaTypes, 1],
  ])('%s', (_label, document, expectedCount) => {
    return linter.run(document).then((results) => {
      expect(results.length).toBe(expectedCount);
    });
  });
});

describe('apiq:OAR038 ok scenarios', () => {
  test.each([
    ['data arrives via a single allOf branch', oar038AllOfComposed],
    ['circular allOf is safely skipped, data branch still found', oar038AllOfCircularSafe],
    ['3.1 nullable array-form type on data does not affect the check', oar038NullableArrayType],
    ['top-level property named exactly "error" alone is valid', oar038ErrorOnly],
  ])('%s', (_label, document) => {
    return linter.run(document).then((results) => {
      expect(results.length).toBe(0);
    });
  });
});

test('apiq:OAR038 custom data-property "result": passes without "data"', () => {
  return linterCustomDataProperty.run(oar038CustomDataProperty).then((results) => {
    expect(results.length).toBe(0);
  });
});
