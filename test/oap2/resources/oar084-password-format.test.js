const { linterForRule } = require('../../helpers/utils');

let linter;

const oar084fail = require('./OAR084/fail-example');
const oar084ok = require('./OAR084/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR084');
  return linter;
});

test('apiq:OAR084 should find errors', () => {
  return linter.run(oar084fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR084 should find no errors', () => {
  return linter.run(oar084ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR084 respects a paths/pathValidationStrategy functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR084', {
    functionOptions: { paths: '', pathValidationStrategy: '/exclude' },
  });

  return customLinter.run(oar084fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR084 respects a forbidden-query-formats functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR084', {
    functionOptions: { 'forbidden-query-formats': 'email' },
  });

  return customLinter.run(oar084ok).then((results) => {
    expect(results.length).toBe(1);
  });
});
