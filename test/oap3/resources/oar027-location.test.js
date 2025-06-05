const { linterForRule } = require('../../helpers/utils');

let linter;

const oar027fail = require('./OAR027/fail-post-201-location');
const oar027ok = require('./OAR027/ok-post-201-location');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR027');
  return linter;
});

test('apiq:OAR027 should find errors', () => {
  return linter.run(oar027fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR027 should find no errors', () => {
  return linter.run(oar027ok).then((results) => {
    expect(results.length).toBe(0);
  });
});