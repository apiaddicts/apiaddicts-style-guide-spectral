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
    expect(results.length).toBe(14);
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
    expect(results.length).toBe(8);
  });
});

test('apiq:OAR011 accepts a single-word UpperCamelCase path but rejects a two-word one, matching Sonar', async () => {
  const customLinter = await linterForRule('apiq:OAR011', {
    functionOptions: { 'naming-convention': 'UpperCamelCase' },
  });
  const singleWordSpec = {
    openapi: '3.0.0',
    info: { version: '1.0.0', title: 'Petstore' },
    paths: { '/User': { get: { responses: { 200: { description: 'ok' } } } } },
  };
  const twoWordSpec = {
    openapi: '3.0.0',
    info: { version: '1.0.0', title: 'Petstore' },
    paths: { '/UserProfile': { get: { responses: { 200: { description: 'ok' } } } } },
  };

  const [singleWordResults, twoWordResults] = await Promise.all([
    customLinter.run(singleWordSpec),
    customLinter.run(twoWordSpec),
  ]);

  expect(singleWordResults.length).toBe(0);
  expect(twoWordResults.length).toBe(1);
});
