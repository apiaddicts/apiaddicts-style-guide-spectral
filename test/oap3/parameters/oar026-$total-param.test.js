const { linterForRule } = require('../../helpers/utils');

let linter;

const oar026fail = require('./OAR026/fail-$total-param');
const oar026ok = require('./OAR026/ok-$total-param');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR026');
  return linter;
});

test('apiq:OAR026 should find errors', () => {
  return linter.run(oar026fail).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./pets.get.parameters.1.schema');
    expect(results[1].path.join('.')).toBe('paths./owners.get.parameters.1.schema');
    expect(results[2].path.join('.')).toBe('paths./stores.get.parameters.1.schema');
  });
});

test('apiq:OAR026 should find no errors', () => {
  return linter.run(oar026ok).then((results) => {
    expect(results.length).toBe(0);
  });
});