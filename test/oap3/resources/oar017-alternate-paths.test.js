const { linterForRule } = require('../../helpers/utils');

let linter;

const oar017fail = require('./OAR017/fail-alternate-paths');
const oar017ok = require('./OAR017/ok-alternate-paths');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR017');
  return linter;
});

test('apiq:OAR017 should find errors', () => {
  return linter.run(oar017fail).then((results) => {
    expect(results.length).toBe(5);
    expect(results[0].path.join('.')).toBe('paths./{one}');
    expect(results[0].severity).toBe(0);
    expect(results[1].path.join('.')).toBe('paths./one/two');
    expect(results[1].severity).toBe(0);
    expect(results[2].path.join('.')).toBe('paths./one/two/{three}');
    expect(results[2].severity).toBe(0);
    expect(results[3].path.join('.')).toBe('paths./one/{two}/three/four');
    expect(results[3].severity).toBe(0);
    expect(results[4].path.join('.')).toBe('paths./one/me/{two}/{three}/{four}');
    expect(results[4].severity).toBe(0);

  });
});

test('apiq:OAR017 should find no errors', () => {
  return linter.run(oar017ok).then((results) => {
    expect(results.length).toBe(0);
  });
});