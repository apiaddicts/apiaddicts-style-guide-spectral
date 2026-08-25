const { linterForRule } = require('../../helpers/utils');

let linter;

const oar096fail = require('./OAR096/fail-example');
const oar096ok = require('./OAR096/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR096');
  return linter;
});

test('apiq:OAR096 should find errors (Swagger 2.0)', () => {
  return linter.run(oar096fail).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./secured.get.responses');
  });
});

test('apiq:OAR096 should find no errors (Swagger 2.0)', () => {
  return linter.run(oar096ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
