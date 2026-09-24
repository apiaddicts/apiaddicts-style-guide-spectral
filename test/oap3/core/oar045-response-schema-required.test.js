const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

let linter;

const oar045failMissingContent = require('./OAR045/fail-missing-content');
const oar045failEmptyContent = require('./OAR045/fail-empty-content');
const oar045okContentPresent = require('./OAR045/ok-content-present');
const oar045failRefResponse = require('./OAR045/fail-ref-response');
const oar045ok31NullableContentSchema = require('./OAR045/ok-31-nullable-content-schema');
const oar045failLargeMultiOperation = require('./OAR045/fail-large-multi-operation');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR045');
  return linter;
});

test('apiq:OAR045 flags an OpenAPI 3.0 response with no content', () => {
  return linter.run(oar045failMissingContent).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path).toEqual(['paths', '/orders', 'post', 'responses', '201']);
  });
});

test('apiq:OAR045 flags an OpenAPI 3.0 response whose content is an empty object', () => {
  return linter.run(oar045failEmptyContent).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path).toEqual(['paths', '/orders', 'post', 'responses', '201']);
  });
});

test('apiq:OAR045 does not flag an OpenAPI 3.0 response with content present', () => {
  return linter.run(oar045okContentPresent).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR045 does not flag an OpenAPI 3.1 response whose schema is a nullable union, as long as content is present', () => {
  return linter.run(oar045ok31NullableContentSchema).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR045 flags a $ref-ed response with no content, attributing the finding to the referenced definition', async () => {
  const document = new Document(
    JSON.stringify(oar045failRefResponse),
    Parsers.Json,
    'fail-ref-response.js',
  );
  const results = await linter.run(document);
  expect(results.length).toBe(1);
  expect(results[0].path).toEqual(['components', 'responses', 'Created']);
});

test('apiq:OAR045 flags exactly the non-compliant responses in a large multi-path, multi-operation document', () => {
  return linter.run(oar045failLargeMultiOperation).then((results) => {
    const expectedPaths = [
      ['paths', '/products', 'get', 'responses', '400'],
      ['paths', '/products', 'post', 'responses', '201'],
      ['paths', '/products/{productId}', 'get', 'responses', '404'],
      ['paths', '/products/{productId}', 'put', 'responses', '404'],
      ['paths', '/orders', 'get', 'responses', '400'],
      ['paths', '/orders', 'post', 'responses', '400'],
      ['paths', '/orders/{orderId}', 'patch', 'responses', '200'],
      ['paths', '/orders/{orderId}', 'delete', 'responses', '404'],
      ['paths', '/customers', 'post', 'responses', '400'],
      ['paths', '/customers/{customerId}/orders', 'get', 'responses', '404'],
    ];

    expect(results.length).toBe(10);

    const byKey = (path) => path.join('.');
    const actualPaths = results.map((r) => r.path).sort((a, b) => byKey(a).localeCompare(byKey(b)));
    const sortedExpectedPaths = [...expectedPaths].sort((a, b) => byKey(a).localeCompare(byKey(b)));
    expect(actualPaths).toEqual(sortedExpectedPaths);
  });
});
