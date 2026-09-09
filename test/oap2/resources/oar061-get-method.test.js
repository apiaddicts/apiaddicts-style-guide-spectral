const { linterForRule } = require('../../helpers/utils');

let linter;

const oar061fail = require('./OAR061/fail-example');
const oar061ok = require('./OAR061/ok-example');

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
