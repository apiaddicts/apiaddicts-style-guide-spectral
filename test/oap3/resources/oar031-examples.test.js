const { linterForRule } = require('../../helpers/utils');

let linter;

const oar031fail = require('./OAR031/fail-examples');
const oar031ok = require('./OAR031/ok-examples');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR031');
  return linter;
});

test('apiq:OAR031 should find errors', () => {
  return linter.run(oar031fail).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./pets.get.responses.206.content.application/json');
    expect(results[0].severity).toBe(0);
    expect(results[1].path.join('.')).toBe('paths./pets/{id}.get.parameters.0');
    expect(results[1].severity).toBe(0);
    expect(results[2].path.join('.')).toBe('paths./pets/{id}.get.responses.200.content.application/json');
    expect(results[2].severity).toBe(0);
  });
});

test('apiq:OAR031 should find no errors', () => {
  return linter.run(oar031ok).then((results) => {
    expect(results.length).toBe(0);
  });
});