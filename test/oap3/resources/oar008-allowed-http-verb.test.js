const { linterForRule } = require('../../helpers/utils');

let linter;

const oar008fail = require('./OAR008/fail-example');
const oar008ok = require('./OAR008/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR008');
  return linter;
});

test('apiq:OAR008 should find errors', () => {
  return linter.run(oar008fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR008 should find no errors', () => {
  return linter.run(oar008ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR008 respects a widened allowed-verbs functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR008', {
    functionOptions: { 'allowed-verbs': 'get,post,put,delete,patch,head,options' },
  });

  return customLinter.run(oar008fail).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR008 still flags a verb left out of a widened allowed-verbs override', async () => {
  const customLinter = await linterForRule('apiq:OAR008', {
    functionOptions: { 'allowed-verbs': 'get,post,put,delete,patch,head' },
  });

  return customLinter.run(oar008fail).then((results) => {
    expect(results.length).toBe(1);
  });
});
