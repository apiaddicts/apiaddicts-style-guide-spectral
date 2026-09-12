const { linterForRule } = require('../../helpers/utils');

let linter;

const oar049failWithContent = require('./OAR049/204-with-content');
const oar049okEmpty = require('./OAR049/204-empty');
const oar049okEmptyObjectContent = require('./OAR049/204-empty-object-content');
const oar049okRefResponse = require('./OAR049/204-ref-response');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR049');
  return linter;
});

describe('apiq:OAR049 (OpenAPI 3.x)', () => {
  test.each([
    ['204 with non-empty content on delete and put', oar049failWithContent, 2],
  ])('%s should be flagged', (_label, doc, expectedCount) => linter.run(doc).then((results) => {
    expect(results.length).toBe(expectedCount);
  }));

  test.each([
    ['204 with no content key on get/post/patch, irrelevant head verb with content ignored', oar049okEmpty],
    ['204 with explicit empty content object', oar049okEmptyObjectContent],
    ['204 resolved via $ref to a shared no-content response', oar049okRefResponse],
  ])('%s should not be flagged', (_label, doc) => linter.run(doc).then((results) => {
    expect(results.length).toBe(0);
  }));
});
