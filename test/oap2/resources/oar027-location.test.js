const { linterForRule } = require('../../helpers/utils');

let linter;

const oar027fail = require('./OAR027/fail-post-201-location');
const oar027ok = require('./OAR027/ok-post-201-location');
const oar027failNoType = require('./OAR027/fail-location-header-no-type');
const oar027okLowercase = require('./OAR027/ok-lowercase-location-header');
const oar027okNonPostIgnored = require('./OAR027/ok-non-post-201-ignored');
const oar027mixed = require('./OAR027/mixed-compliant-and-noncompliant');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR027');
  return linter;
});

test('apiq:OAR027 should find errors', () => {
  return linter.run(oar027fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR027 should find no errors when Location is declared directly (no schema wrapper)', () => {
  return linter.run(oar027ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR027 should flag a Location header with no type', () => {
  return linter.run(oar027failNoType).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR027 should accept a lowercase location header', () => {
  return linter.run(oar027okLowercase).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR027 should not flag a 201 response on a non-POST operation', () => {
  return linter.run(oar027okNonPostIgnored).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR027 should flag only the noncompliant POST 201 among multiple paths', () => {
  return linter.run(oar027mixed).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toContain('orders');
  });
});
