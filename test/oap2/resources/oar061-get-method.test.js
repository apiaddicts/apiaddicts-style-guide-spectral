const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

let linter;

const oar061fail = require('./OAR061/fail-example');
const oar061ok = require('./OAR061/ok-example');
const oar061failMissingResponses = require('./OAR061/fail-missing-responses');
const oar061failOnlyNonMandatory = require('./OAR061/fail-only-non-mandatory');
const oar061okMultipleMandatoryCodes = require('./OAR061/ok-multiple-mandatory-codes');
const oar061failMixedPaths = require('./OAR061/fail-mixed-paths');
const oar061okExcludedStatusPath = require('./OAR061/ok-excluded-status-path');
const oar061okExcludedAnotherPath = require('./OAR061/ok-excluded-another-path');
const oar061okRefResponses = require('./OAR061/ok-ref-responses');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR061');
  return linter;
});

test('apiq:OAR061 should find errors', () => {
  return linter.run(oar061fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR061 should find no errors', () => {
  return linter.run(oar061ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR061 respects a mandatory-response-codes functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR061', {
    functionOptions: { 'mandatory-response-codes': '200, 202, 206, 400' },
  });

  return customLinter.run(oar061fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR061 respects a paths/pathValidationStrategy functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR061', {
    functionOptions: { paths: '/status, /another, /pets', pathValidationStrategy: '/exclude' },
  });

  return customLinter.run(oar061fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR061 does not flag an operation that declares more than one mandatory code at once', () => {
  const spec = {
    swagger: '2.0',
    info: { version: '1.0.0', title: 'Petstore' },
    paths: {
      '/pets': {
        get: {
          responses: {
            200: { description: 'ok' },
            202: { description: 'accepted' },
          },
        },
      },
    },
  };

  return linter.run(spec).then((results) => {
    expect(results.length).toBe(0);
  });
});

test.each([
  ['a GET operation with responses entirely missing', oar061failMissingResponses],
  ['a GET operation whose only response code is non-mandatory', oar061failOnlyNonMandatory],
])('apiq:OAR061 flags %s', (_label, fixture) => {
  return linter.run(fixture).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR061 does not double-count a GET declaring multiple mandatory codes at once', () => {
  return linter.run(oar061okMultipleMandatoryCodes).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR061 flags exactly the non-compliant path in a multi-path document', () => {
  return linter.run(oar061failMixedPaths).then((results) => {
    expect(results.length).toBe(1);
  });
});

test.each([
  ['/status', oar061okExcludedStatusPath],
  ['/another', oar061okExcludedAnotherPath],
])('apiq:OAR061 silently excludes the default-excluded path %s', (_label, fixture) => {
  return linter.run(fixture).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR061 resolves a whole responses object reached via $ref and does not false-positive', async () => {
  const document = new Document(
    JSON.stringify(oar061okRefResponses),
    Parsers.Json,
    'ok-ref-responses.js',
  );
  const results = await linter.run(document);
  expect(results.length).toBe(0);
});
