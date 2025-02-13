const { linterForRule } = require('../../helpers/utils');

let linter;

const failServerUrl = require('./OAR101/file-example');
const okServerUrl = require('./OAR101/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR101');
  return linter;
});

test('apiq:OAR101 should find errors for incorrect server URL format', () => {
  return linter.run(failServerUrl).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('servers.0.url');
  });
});

test('apiq:OAR101 should find no errors for correct server URL format', () => {
  return linter.run(okServerUrl).then((results) => {
    expect(results.length).toBe(0);
  });
});
