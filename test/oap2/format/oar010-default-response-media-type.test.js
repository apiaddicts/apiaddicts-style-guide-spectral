const { linterForRule } = require('../../helpers/utils');

let linter;

const oar010fail = require('./OAR010/fail-example');
const oar010ok = require('./OAR010/ok-example');
const oar010failMixedCase = require('./OAR010/fail-mixed-case');
const oar010okMixedCase = require('./OAR010/ok-mixed-case');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR010');
  return linter;
});

test('apiq:OAR010 should find errors', () => {
  return linter.run(oar010fail).then((results) => {
    expect(results.length).toBe(3);
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

test('apiq:OAR010 does not flag a mixed-case default media type in produces', () => {
  return linter.run(oar010okMixedCase).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR010 flags a wrong media type in produces regardless of case', () => {
  return linter.run(oar010failMixedCase).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR010 respects a mixed-case media-type-exceptions functionOptions override case-insensitively', async () => {
  const customLinter = await linterForRule('apiq:OAR010', {
    functionOptions: { 'media-type-exceptions': 'Application/XML' },
  });

  return customLinter.run(oar010failMixedCase).then((results) => {
    expect(results.length).toBe(0);
  });
});
