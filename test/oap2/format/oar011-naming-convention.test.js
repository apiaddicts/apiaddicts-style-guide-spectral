const { linterForRule } = require('../../helpers/utils');

let linter;

const oar011fail = require('./OAR011/fail-example');
const oar011ok = require('./OAR011/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR011');
  return linter;
});

test('apiq:OAR011 should find errors', () => {
  return linter.run(oar011fail).then((results) => {
    expect(results.length).toBe(7);
  });
});

test('apiq:OAR011 should find no errors', () => {
  return linter.run(oar011ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR011 respects a naming-convention functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR011', {
    functionOptions: { 'naming-convention': 'snake_case' },
  });

  return customLinter.run(oar011ok).then((results) => {
    expect(results.length).toBe(5);
  });
});

test('apiq:OAR011 rejects digits under a camelCase override, matching Sonar (no digits allowed)', async () => {
  const customLinter = await linterForRule('apiq:OAR011', {
    functionOptions: { 'naming-convention': 'camelCase' },
  });
  const spec = {
    swagger: '2.0',
    info: { version: '1.0.0', title: 'Petstore' },
    host: 'api.example.com',
    basePath: '/',
    paths: { '/user2Profile': { get: { responses: { 200: { description: 'ok' } } } } },
  };

  return customLinter.run(spec).then((results) => {
    expect(results.length).toBe(1);
  });
});
