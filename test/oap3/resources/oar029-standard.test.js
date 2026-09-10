const { linterForRule } = require('../../helpers/utils');

const oar029fail = require('./OAR029/invalid');
const oar029ok = require('./OAR029/valid');

const CONFIGURED_SCHEMA = JSON.stringify({
  requiredAlways: ['status', 'payload'],
  dataProperty: 'payload',
  properties: {
    status: { type: 'object', properties: { code: { type: 'integer' } }, required: ['code'] },
    payload: { type: 'any' },
  },
});

let linter;

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR029');
  return linter;
});

test('apiq:OAR029 reports nothing until a response-schema is configured', () => {
  return linter.run(oar029fail).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR029 should find no errors', () => {
  return linter.run(oar029ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR029 should find errors once a response-schema is configured', async () => {
  const configured = await linterForRule('apiq:OAR029', {
    functionOptions: { 'response-schema': CONFIGURED_SCHEMA },
  });
  const results = await configured.run(oar029fail);
  expect(results.length).toBe(3);
});

test('apiq:OAR029 honours path-exclusions with the same key Sonar uses', async () => {
  const excluded = await linterForRule('apiq:OAR029', {
    functionOptions: { 'response-schema': CONFIGURED_SCHEMA, 'path-exclusions': '/endpoint' },
  });
  const results = await excluded.run(oar029fail);
  expect(results.length).toBe(0);
});
