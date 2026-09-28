const { linterForRule } = require('../../helpers/utils');

let linter;

const oar043fail = require('./OAR043/fail-example');
const oar043ok = require('./OAR043/ok-example');
const oar043failInvalidTypeVarious = require('./OAR043/fail-invalid-type-various');
const oar043failRefParameter = require('./OAR043/fail-ref-parameter');
const oar043okRefParameter = require('./OAR043/ok-ref-parameter');
const oar043okNullableArrayType31 = require('./OAR043/ok-nullable-array-type-31');
const oar043okTypeNotValidated31 = require('./OAR043/ok-type-not-validated-31');
const oar043okQuerystringIn32 = require('./OAR043/ok-querystring-in-32');
const oar043failQuerystringIn31 = require('./OAR043/fail-querystring-in-31');
const oar043failWebhooks31 = require('./OAR043/fail-webhooks-31');
const oar043okWebhooks31 = require('./OAR043/ok-webhooks-31');
const oar043failPathItems31 = require('./OAR043/fail-path-items-31');
const oar043okPathItems31 = require('./OAR043/ok-path-items-31');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR043');
  return linter;
});

test('apiq:OAR043 should find errors', () => {
  return linter.run(oar043fail).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR043 should find no errors', () => {
  return linter.run(oar043ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR043 flags non-JSON-Schema type aliases (int, float)', () => {
  return linter.run(oar043failInvalidTypeVarious).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('apiq:OAR043 resolves a $ref to components.parameters and flags an invalid "in" only once, at the definition', () => {
  return linter.run(oar043failRefParameter).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR043 accepts a compliant $ref to components.parameters', () => {
  return linter.run(oar043okRefParameter).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR043 (3.1) accepts a nullable array type ["string", "null"]', () => {
  return linter.run(oar043okNullableArrayType31).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR043 (3.1) never validates "type" at all, matching Sonar\'s grammar limitation for 3.1/3.2', () => {
  return linter.run(oar043okTypeNotValidated31).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR043 (3.2) accepts "querystring" as a valid "in" value', () => {
  return linter.run(oar043okQuerystringIn32).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR043 (3.1) rejects "querystring" as an "in" value (only valid starting 3.2)', () => {
  return linter.run(oar043failQuerystringIn31).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR043 (3.1) flags an invalid parameter under webhooks', () => {
  return linter.run(oar043failWebhooks31).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR043 (3.1) accepts a compliant parameter under webhooks', () => {
  return linter.run(oar043okWebhooks31).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR043 (3.1) flags an invalid parameter under components.pathItems', () => {
  return linter.run(oar043failPathItems31).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR043 (3.1) accepts a compliant parameter under components.pathItems', () => {
  return linter.run(oar043okPathItems31).then((results) => {
    expect(results.length).toBe(0);
  });
});
