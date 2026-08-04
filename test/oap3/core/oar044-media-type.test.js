const { linterForRule } = require('../../helpers/utils');

let linter;

const oar044ok = require('./OAR044/ok-media-type');
const oar044fail = require('./OAR044/fail-media-type');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR044');
  return linter;
});

test('apiq:OAR044 should find no errors on valid media types', () => {
  return linter.run(oar044ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR044 should find errors on invalid media types', () => {
  return linter.run(oar044fail).then((results) => {
    expect(results.length).toBe(6);
  });
});
