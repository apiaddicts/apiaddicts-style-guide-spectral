const { linterForRule } = require('../../helpers/utils');

let linter;

const oar051fail = require('./OAR051/fail-descriptions');
const oar051ok = require('./OAR051/ok-descriptions');

beforeAll(async () => {
  linter = await linterForRule('openapi-custom:OAR051');
  return linter;
});

test('openapi-custom:OAR051 should find errors', () => {
  return linter.run(oar051fail).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join(".")).toBe('paths./pets.post');
    expect(results[1].path.join(".")).toBe("paths./pets.get");
  });
});

test('openapi-custom:OAR051 should find no errors', () => {
  return linter.run(oar051ok).then((results) => {
    expect(results.length).toBe(0);
  });
});