const { linterForRule } = require('../../helpers/utils');

let linter;

const oar026fail = require('./OAR026/fail-$total-param');
const oar026ok = require('./OAR026/ok-$total-param');
const oar026okPostOperation = require('./OAR026/ok-post-operation');
const oar026okHeaderParam = require('./OAR026/ok-header-param');
const oar026okUnreferencedRef = require('./OAR026/ok-unreferenced-ref');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR026');
  return linter;
});

test('apiq:OAR026 should find errors', () => {
  return linter.run(oar026fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR026 should find no errors', () => {
  return linter.run(oar026ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR026 should not flag $total on a non-GET operation', () => {
  return linter.run(oar026okPostOperation).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR026 should not flag a $total parameter that is not in:query', () => {
  return linter.run(oar026okHeaderParam).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR026 should not flag an unreferenced $ref $total parameter', () => {
  return linter.run(oar026okUnreferencedRef).then((results) => {
    expect(results.length).toBe(0);
  });
});