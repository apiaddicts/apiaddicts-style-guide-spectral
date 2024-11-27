const { linterForRule } = require('../../helpers/utils');

let linter;

const oar011fail = require('./OAR011/fail-naming');
const oar011ok = require('./OAR011/ok-naming');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR011');
  return linter;
});

test('apiq:OAR011 should find errors', () => {
  return linter.run(oar011fail).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./Pets');
    expect(results[1].path.join('.')).toBe('paths./Pets/{Id}');
  });
});

test('apiq:OAR011 should find no errors', () => {
  return linter.run(oar011ok).then((results) => {
    expect(results.length).toBe(0);
  });
});