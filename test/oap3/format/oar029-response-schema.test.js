const { linterForRule } = require('../../helpers/utils');

let linter;

const oar029fail = require('./OAR029/fail-response-schema');
const oar029ok = require('./OAR029/ok-response-schema');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR029');
  return linter;
});

test('apiq:OAR029 should find errors', () => {
  return linter.run(oar029fail).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./pets.post.responses.200.content.application/json.schema');
    expect(results[1].path.join('.')).toBe('paths./pets/{petId}.get.responses.200.content.application/json.schema');
  });
});

test('apiq:OAR029 should find no errors', () => {
  return linter.run(oar029ok).then((results) => {
    expect(results.length).toBe(0);
  });
});