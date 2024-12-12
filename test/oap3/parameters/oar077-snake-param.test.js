const { linterForRule } = require('../../helpers/utils');

let linter;

const oar077fail = require('./OAR077/fail-snake-param');
const oar077ok = require('./OAR077/ok-snake-param');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR077');
  return linter;
});

test('apiq:OAR077 should find errors', () => {
  return linter.run(oar077fail).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./pets.get.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./pets.get.parameters.1.name');
    expect(results[2].path.join('.')).toBe('paths./pets.get.parameters.2.name');
  });
});

test('apiq:OAR077 should find no errors', () => {
  return linter.run(oar077ok).then((results) => {
    expect(results.length).toBe(0);
  });
});