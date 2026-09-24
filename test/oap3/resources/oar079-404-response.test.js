const { linterForRule } = require('../../helpers/utils');

let linter;

const oar079fail = require('./OAR079/fail-parameter-404-response');
const oar079ok = require('./OAR079/ok-parameter-404-response');
const oar079failSharedPathItemParameter = require('./OAR079/fail-shared-path-item-parameter-no-404');
const oar079okSharedPathItemParameter = require('./OAR079/ok-shared-path-item-parameter-with-404');
const oar079failLargeMultiPath = require('./OAR079/fail-large-multi-path');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR079');
  return linter;
});

test('apiq:OAR079 should find errors', () => {
  return linter.run(oar079fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR079 should find no errors', () => {
  return linter.run(oar079ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR079 should report a path-item-level shared parameter with no operation-level parameters at all', () => {
  return linter.run(oar079failSharedPathItemParameter).then((results) => {
    expect(results.length).toBe(1);
    expect(results.map((r) => r.path.join('.'))).toEqual([
      'paths./devices/{deviceId}.get',
    ]);
  });
});

test('apiq:OAR079 should not report a shared path-item parameter once the operation has a 404', () => {
  return linter.run(oar079okSharedPathItemParameter).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR079 should evaluate shared and operation-level path parameters correctly across a large multi-path document', () => {
  return linter.run(oar079failLargeMultiPath).then((results) => {
    expect(results.length).toBe(5);
    expect(results.map((r) => r.path.join('.')).sort()).toEqual([
      'paths./devices/{deviceId}.get',
      'paths./devices/{deviceId}.patch',
      'paths./reports/{reportId}.get',
      'paths./reports/{reportId}/export.get',
      'paths./tickets/{ticketId}.get',
    ]);
  });
});