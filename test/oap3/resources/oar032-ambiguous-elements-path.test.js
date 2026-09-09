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

test('apiq:OAR032 flags a Spanish ambiguous word by default, matching Sonar', () => {
  const spec = {
    openapi: '3.0.0',
    info: { version: '1.0.0', title: 'Petstore' },
    paths: { '/catalogo/recursos': { get: { responses: { 200: { description: 'ok' } } } } },
  };

  return linter.run(spec).then((results) => {
    expect(results.length).toBe(1);
  });
});
