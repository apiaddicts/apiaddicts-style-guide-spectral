const { linterForRule } = require('../../helpers/utils');

let linter;

const oar084fail = require('./OAR084/fail-example');
const oar084ok = require('./OAR084/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR084');
  return linter;
});

test('apiq:OAR084 should find errors', () => {
  return linter.run(oar084fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR084 should find no errors', () => {
  return linter.run(oar084ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

const oar084failSharedPathItem = require('./OAR084/fail-shared-path-item-query-param');
const oar084okSharedPathItemExcludedPath = require('./OAR084/ok-shared-path-item-query-param-excluded-path');
const oar084failLargeMultiPath = require('./OAR084/fail-large-multi-path');

test('apiq:OAR084 flags a forbidden format on a shared path-item-level query parameter (broad functionOptions override)', async () => {
  const customLinter = await linterForRule('apiq:OAR084', {
    functionOptions: { 'forbidden-query-formats': 'password', paths: '', pathValidationStrategy: '/exclude' },
  });

  return customLinter.run(oar084failSharedPathItem).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR084 does not flag a shared path-item-level password parameter on a non-/examples path under the DEFAULT functionOptions', () => {
  return linter.run(oar084okSharedPathItemExcludedPath).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR084 flags forbidden-format params across shared and operation-level query parameters on several paths/verbs (broad functionOptions override)', async () => {
  const customLinter = await linterForRule('apiq:OAR084', {
    functionOptions: { 'forbidden-query-formats': 'password', paths: '', pathValidationStrategy: '/exclude' },
  });

  return customLinter.run(oar084failLargeMultiPath).then((results) => {
    expect(results.length).toBe(3);
  });
});
