const { linterForRule } = require('../../helpers/utils');

let linter;

const oar085fail = require('./OAR085/fail-example');
const oar085ok = require('./OAR085/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR085');
  return linter;
});

test('apiq:OAR085 should find errors (Swagger 2.0, unsupported version)', () => {
  return linter.run(oar085fail).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('swagger');
  });
});

test('apiq:OAR085 should find no errors (Swagger 2.0, supported version)', () => {
  return linter.run(oar085ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
