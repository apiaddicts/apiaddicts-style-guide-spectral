const { linterForRule } = require('../../helpers/utils');

let linter;

const oar077fail = require('./OAR077/fail-snake-param');
const oar077ok = require('./OAR077/ok-snake-param');
const oar077failSharedPathItem = require('./OAR077/fail-shared-path-item-query-param');
const oar077okSharedPathItem = require('./OAR077/ok-shared-path-item-query-param');
const oar077failDigitInName = require('./OAR077/fail-digit-in-name');
const oar077failLargeMultiPath = require('./OAR077/fail-large-multi-path');
const oar077failRefQueryParam = require('./OAR077/fail-ref-query-param');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR077');
  return linter;
});

test('apiq:OAR077 should find errors', () => {
  return linter.run(oar077fail).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./pets.get.parameters.0.name');
    expect(results[1].path.join('.')).toBe('paths./pets.get.parameters.1.name');
    expect(results[2].path.join('.')).toBe('paths./pets.get.parameters.2.name');
  });
});

test('apiq:OAR077 should find no errors', () => {
  return linter.run(oar077ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR077 flags a bad name on a shared path-item-level query parameter', () => {
  return linter.run(oar077failSharedPathItem).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./pets.parameters.0.name');
  });
});

test('apiq:OAR077 accepts a snake_case shared path-item-level query parameter', () => {
  return linter.run(oar077okSharedPathItem).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR077 flags a query parameter name containing a digit (default regex has no digit support)', () => {
  return linter.run(oar077failDigitInName).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR077 flags bad names across shared and operation-level query parameters on several paths/verbs', () => {
  return linter.run(oar077failLargeMultiPath).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('apiq:OAR077 flags a bad name reached only through a $ref query parameter', () => {
  return linter.run(oar077failRefQueryParam).then((results) => {
    expect(results.length).toBe(1);
  });
});
