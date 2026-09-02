const { linterForRule } = require('../../helpers/utils');

let linter;

const oar085fail = require('./OAR085/fail-example');
const oar085ok = require('./OAR085/ok-example');
const oar085ok304 = require('./OAR085/ok-304-example');
const oar085ok311 = require('./OAR085/ok-311-example');
const oar085ok320 = require('./OAR085/ok-320-example');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR085');
  return linter;
});

test('apiq:OAR085 should find errors (OpenAPI 3.0, unsupported version)', () => {
  return linter.run(oar085fail).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('openapi');
  });
});

test('apiq:OAR085 should find no errors (OpenAPI 3.0.0)', () => {
  return linter.run(oar085ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR085 should accept 3.0.4 by default', () => {
  return linter.run(oar085ok304).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR085 should accept 3.1.1 by default', () => {
  return linter.run(oar085ok311).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR085 should accept 3.2.0 by default', () => {
  return linter.run(oar085ok320).then((results) => {
    expect(results.length).toBe(0);
  });
});
