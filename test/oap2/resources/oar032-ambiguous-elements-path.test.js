const { linterForRule } = require('../../helpers/utils');

let linter;

const oar032fail = require('./OAR032/fail-example');
const oar032ok = require('./OAR032/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR032');
  return linter;
});

test('apiq:OAR032 should find errors', () => {
  return linter.run(oar032fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR032 should find no errors', () => {
  return linter.run(oar032ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR032 respects an ambiguous-names functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR032', {
    functionOptions: { 'ambiguous-names': 'elements,instances' },
  });

  return customLinter.run(oar032fail).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR032 matches whole path segments only, not substrings, matching Sonar', () => {
  const spec = {
    swagger: '2.0',
    info: { version: '1.0.0', title: 'Petstore' },
    host: 'api.example.com',
    basePath: '/',
    paths: { '/myresources': { get: { responses: { 200: { description: 'ok' } } } } },
  };

  return linter.run(spec).then((results) => {
    expect(results.length).toBe(0);
  });
});
