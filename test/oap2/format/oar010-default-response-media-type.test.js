const { linterForRule } = require('../../helpers/utils');

let linter;

const oar010fail = require('./OAR010/fail-example');
const oar010ok = require('./OAR010/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR010');
  return linter;
});

test('apiq:OAR010 should find errors', () => {
  return linter.run(oar010fail).then((results) => {
    expect(results.length).toBe(5);
  });
});

test('apiq:OAR010 should find no errors', () => {
  return linter.run(oar010ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR010 respects a custom default-media-type functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR010', {
    functionOptions: { 'default-media-type': 'application/xml' },
  });

  return customLinter.run(oar010fail).then((results) => {
    expect(results.length).toBe(2);
  });
});
