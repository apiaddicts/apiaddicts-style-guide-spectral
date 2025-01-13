const { linterForRule } = require('../../helpers/utils');

let linter;

const failServerUrl = require('./OAR035/file-example');
const okServerUrl = require('./OAR035/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR035');
  return linter;
});

test('apiq:OAR035 should find errors for operations without 401 response for security schemes', () => {

  return linter.run(failServerUrl).then((results) => {
    expect(results.length).toBe(1);  
      expect(results[0].path.join('.')).toBe('paths./with-auth-and-header.get.responses');
  });
});

test('apiq:OAR035 should find no errors for operations with 401 response for security schemes', () => {
  return linter.run(okServerUrl).then((results) => {
    expect(results.length).toBe(0);
  });
});
