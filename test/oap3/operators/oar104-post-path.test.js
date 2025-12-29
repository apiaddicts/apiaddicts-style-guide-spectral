const { linterForRule } = require('../../helpers/utils'); 

let linter;

const oar104fail = require('./OAR104/fail-post-path'); 
const oar104ok = require('./OAR104/ok-post-path'); 

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR104');
  return linter;
});

test('apiq:OAR104 should find errors', () => {
  return linter.run(oar104fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR104 should find no errors', () => {
  return linter.run(oar104ok).then((results) => {
    expect(results.length).toBe(0); 
  });
});
