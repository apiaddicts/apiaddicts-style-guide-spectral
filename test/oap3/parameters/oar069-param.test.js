const { linterForRule } = require('../../helpers/utils');

let linter;

const oar069fail = require('./OAR069/fail-params');
const oar069ok = require('./OAR069/ok-params');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR069');
  return linter;
});

test('apiq:OAR069 should find errors', () => {
  return linter.run(oar069fail).then((results) => {
    expect(results.length).toBe(1);  
    expect(results[0].path.join('.')).toBe('paths./pets.get.responses');
  });
});

test('apiq:OAR069 should find no errors', () => {
  return linter.run(oar069ok).then((results) => {
    expect(results.length).toBe(0);  
  });
});
