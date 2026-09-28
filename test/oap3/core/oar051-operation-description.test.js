const { linterForRule } = require('../../helpers/utils');

let linter;

const oar051fail = require('./OAR051/fail-descriptions');
const oar051ok = require('./OAR051/ok-descriptions');
const oar051failPathTarget = require('./OAR051/fail-path-targets-summary');
const oar051failExactDuplicate = require('./OAR051/fail-exact-duplicate');
const oar051failSemanticDuplicate = require('./OAR051/fail-semantic-duplicate');
const oar051okDifferentEnough = require('./OAR051/ok-different-enough');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR051');
  return linter;
});

test('apiq:OAR051 should find errors', () => {
  return linter.run(oar051fail).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR051 should find no errors', () => {
  return linter.run(oar051ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR051 finding path always ends in "summary", never "description" (confirmed intentional)', () => {
  return linter.run(oar051failPathTarget).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path[results[0].path.length - 1]).toBe('summary');
    expect(results[0].path[results[0].path.length - 1]).not.toBe('description');
  });
});

test('apiq:OAR051 flags exact-duplicate summary/description (case + whitespace variations)', () => {
  return linter.run(oar051failExactDuplicate).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('apiq:OAR051 flags semantically-duplicate (reworded, non-identical) summary/description, with a similarity suffix', () => {
  return linter.run(oar051failSemanticDuplicate).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toMatch(/^OAR051: Summary and description must be meaningfully different from each other\. \(\d+% similar\)$/);
  });
});

test('apiq:OAR051 exact-duplicate finding has no similarity suffix', () => {
  return linter.run(oar051failExactDuplicate).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('OAR051: Summary and description must be meaningfully different from each other.');
  });
});

test('apiq:OAR051 does not flag summary/description that are clearly different', () => {
  return linter.run(oar051okDifferentEnough).then((results) => {
    expect(results.length).toBe(0);
  });
});