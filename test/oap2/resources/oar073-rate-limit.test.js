const { linterForRule } = require('../../helpers/utils');

let linter;

const oar073fail = require('./OAR073/fail-example');
const oar073ok = require('./OAR073/ok-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR073');
  return linter;
});

test('apiq:OAR073 should find errors', () => {
  return linter.run(oar073fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR073 should find no errors', () => {
  return linter.run(oar073ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR073 respects a paths/pathValidationStrategy functionOptions override', async () => {
  const customLinter = await linterForRule('apiq:OAR073', {
    functionOptions: {
      paths: '/status, /health, /health-check, /ping, /liveness, /readiness, /pets',
      pathValidationStrategy: '/exclude',
    },
  });

  return customLinter.run(oar073fail).then((results) => {
    expect(results.length).toBe(2);
  });
});
