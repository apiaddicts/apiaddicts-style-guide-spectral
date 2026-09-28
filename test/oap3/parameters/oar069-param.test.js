const { linterForRule } = require('../../helpers/utils');

let linter;

const oar069fail = require('./OAR069/fail-params');
const oar069ok = require('./OAR069/ok-params');
const oar069failSharedPathItemParameter = require('./OAR069/fail-shared-path-item-parameter');
const oar069okSharedParameterWith400 = require('./OAR069/ok-shared-parameter-with-400');
const oar069failOperationOverridesShared = require('./OAR069/fail-operation-overrides-shared');
const oar069failSharedAndOperationDistinctParams = require('./OAR069/fail-shared-and-operation-distinct-params');
const oar069failSharedRefParameter = require('./OAR069/fail-shared-ref-parameter');
const oar069failLargeMultiPath = require('./OAR069/fail-large-multi-path');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR069');
  return linter;
});

test('apiq:OAR069 should find errors', () => {
  return linter.run(oar069fail).then((results) => {
    expect(results.length).toBe(3);
    expect(results.map((r) => r.path.join('.'))).toEqual([
      'paths./pets.get.parameters.0',
      'paths./pets.get.parameters.1',
      'paths./pets.get.parameters.2',
    ]);
  });
});

test('apiq:OAR069 should find no errors', () => {
  return linter.run(oar069ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR069 should report a path-item-level shared parameter with no operation-level parameters at all', () => {
  return linter.run(oar069failSharedPathItemParameter).then((results) => {
    expect(results.length).toBe(1);
    expect(results.map((r) => r.path.join('.'))).toEqual([
      'paths./things/{id}.parameters.0',
    ]);
  });
});

test('apiq:OAR069 should not report a shared parameter once the operation has a 400', () => {
  return linter.run(oar069okSharedParameterWith400).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR069 should report only the operation-level override, not the shared parameter it overrides', () => {
  return linter.run(oar069failOperationOverridesShared).then((results) => {
    expect(results.length).toBe(1);
    expect(results.map((r) => r.path.join('.'))).toEqual([
      'paths./things/{id}.get.parameters.0',
    ]);
  });
});

test('apiq:OAR069 should report both a shared and a distinct operation-level parameter', () => {
  return linter.run(oar069failSharedAndOperationDistinctParams).then((results) => {
    expect(results.length).toBe(2);
    expect(results.map((r) => r.path.join('.')).sort()).toEqual([
      'paths./things/{id}.get.parameters.0',
      'paths./things/{id}.parameters.0',
    ]);
  });
});

test('apiq:OAR069 should dereference a $ref-ed shared path-item parameter', () => {
  return linter.run(oar069failSharedRefParameter).then((results) => {
    expect(results.length).toBe(1);
    expect(results.map((r) => r.path.join('.'))).toEqual([
      'paths./orders/{orderId}.parameters.0',
    ]);
  });
});

test('apiq:OAR069 should evaluate shared vs operation-level parameters correctly across a large multi-path document', () => {
  return linter.run(oar069failLargeMultiPath).then((results) => {
    expect(results.length).toBe(9);
    expect(results.map((r) => r.path.join('.')).sort()).toEqual([
      'paths./orders/{orderId}.parameters.0',
      'paths./tasks.get.parameters.0',
      'paths./tasks/{taskId}.delete.parameters.0',
      'paths./tasks/{taskId}.delete.parameters.1',
      'paths./tasks/{taskId}.parameters.0',
      'paths./tasks/{taskId}/comments.get.parameters.0',
      'paths./tasks/{taskId}/comments.parameters.0',
      'paths./users/{userId}.get.parameters.0',
      'paths./users/{userId}.get.parameters.1',
    ]);
  });
});
