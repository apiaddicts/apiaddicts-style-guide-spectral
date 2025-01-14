const { linterForRule } = require('../../helpers/utils');

let linter;

const failServerUrl = require('./OAR102/file-example');
const okServerUrl = require('./OAR102/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR102');
  return linter;
});

test('apiq:OAR102 should find errors for incorrect second part of the path', () => {
  return linter.run(failServerUrl).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('servers.0.url');
  });
});

test('apiq:OAR102 should find no errors for correct second part of the path', () => {
  return linter.run(okServerUrl).then((results) => {
    expect(results.length).toBe(0);
  });
});
