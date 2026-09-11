const { linterForRule } = require('../../helpers/utils');

let linter;

const oar043fail = require('./OAR043/fail-example');
const oar043ok = require('./OAR043/ok-example');
const oar043failInvalidInCookie = require('./OAR043/fail-invalid-in-cookie');
const oar043okBodyIn = require('./OAR043/ok-body-in');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR043');
  return linter;
});

test('apiq:OAR043 should find errors', () => {
  return linter.run(oar043fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR043 should find no errors', () => {
  return linter.run(oar043ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR043 flags "cookie" as an invalid "in" value for Swagger 2.0', () => {
  return linter.run(oar043failInvalidInCookie).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR043 accepts "in: body" for Swagger 2.0', () => {
  return linter.run(oar043okBodyIn).then((results) => {
    expect(results.length).toBe(0);
  });
});
