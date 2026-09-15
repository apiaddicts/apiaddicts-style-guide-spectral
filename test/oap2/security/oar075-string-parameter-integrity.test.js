const { linterForRule } = require('../../helpers/utils');

let linter;

const oar075fail = require('./OAR075/fail-example');
const oar075ok = require('./OAR075/ok-example');
const oar075failFormat = require('./OAR075/fail-format-exemption');
const oar075okFormat = require('./OAR075/ok-format-exemption');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR075');
  return linter;
});

test('apiq:OAR075 should find errors in Swagger 2.0, where parameters carry `type` directly', () => {
  return linter.run(oar075fail).then((results) => {
    expect(results.length).toBe(6);
  });
});

test('apiq:OAR075 should find no errors', () => {
  return linter.run(oar075ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR075 should find errors when the format is not self-constrained', () => {
  return linter.run(oar075failFormat).then((results) => {
    expect(results.length).toBe(13);
  });
});

test('apiq:OAR075 should find no errors when the format is self-constrained', () => {
  return linter.run(oar075okFormat).then((results) => {
    expect(results.length).toBe(0);
  });
});
