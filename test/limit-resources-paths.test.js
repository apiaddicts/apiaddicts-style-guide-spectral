const { linterForRule } = require('./helpers/utils');

let linter;

const oar014fail = require('./oap3/resources/OAR014/fail-limit-ressorces-paths');
const oar014ok = require('./oap3/resources/OAR014/ok-limit-ressorces-paths');

beforeAll(async () => {
  linter = await linterForRule('openapi-custom:OAR014');
  return linter;
});

test('openapi-custom:OAR014 should find errors', () => {
  return linter.run(oar014fail).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./one/two/three/four/five');
    expect(results[0].severity).toBe(1);
  });
});

test('openapi-custom:OAR014 should find no errors', () => {
  return linter.run(oar014ok).then((results) => {
    expect(results.length).toBe(0);
  });
});