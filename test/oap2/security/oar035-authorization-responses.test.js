const { linterForRule } = require('../../helpers/utils');

let linter;

const oar035fail = require('./OAR035/fail-example');
const oar035ok = require('./OAR035/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR035');
  return linter;
});

test('apiq:OAR035 should find errors (Swagger 2.0)', () => {
  return linter.run(oar035fail).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./secured.get.responses');
  });
});

test('apiq:OAR035 should find no errors (Swagger 2.0)', () => {
  return linter.run(oar035ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
