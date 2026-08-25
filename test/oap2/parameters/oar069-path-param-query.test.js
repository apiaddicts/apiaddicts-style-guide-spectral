const { linterForRule } = require('../../helpers/utils');

let linter;

const oar069fail = require('./OAR069/fail-example');
const oar069ok = require('./OAR069/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR069');
  return linter;
});

test('apiq:OAR069 should find errors (Swagger 2.0)', () => {
  return linter.run(oar069fail).then((results) => {
    expect(results.length).toBe(2);
    expect(results.map((r) => r.path.join('.')).sort()).toEqual([
      'paths./items.get.parameters.0',
      'paths./things/{id}.get.parameters.0',
    ]);
  });
});

test('apiq:OAR069 should find no errors (Swagger 2.0)', () => {
  return linter.run(oar069ok).then((results) => {
    expect(results.length).toBe(0);
  });
});
