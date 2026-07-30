const { Spectral } = require('@stoplight/spectral-core');
const { migrateRuleset } = require('@stoplight/spectral-ruleset-migrator');
const fs = require('fs');
const path = require('path');

const AsyncFunction = (async () => {}).constructor;

const rulesetFile = './apq-spectral.yaml';

async function loadRuleset(file) {
  const m = {};
  const paths = [path.dirname(file), __dirname, '../..'];
  await AsyncFunction(
    'module, require',
    await migrateRuleset(file, {
      format: 'commonjs',
      fs,
    }),
    // eslint-disable-next-line import/no-dynamic-require,global-require
  )(m, (text) => require(require.resolve(text, { paths })));
  const ruleset = m.exports;
  delete ruleset.extends;
  return ruleset;
}

async function linterForRule(rule, { namingConvention, functionOptions } = {}) {
  const linter = new Spectral();

  const ruleset = await loadRuleset(rulesetFile);
  Object.keys(ruleset.rules).forEach((key) => {
    if (key !== rule) {
      delete ruleset.rules[key];
    }
  });
  if (namingConvention && ruleset.rules[rule] && ruleset.rules[rule].then) {
    ruleset.rules[rule].then.functionOptions = {
      ...ruleset.rules[rule].then.functionOptions,
      namingConvention,
    };
  }
  if (functionOptions && ruleset.rules[rule] && ruleset.rules[rule].then) {
    ruleset.rules[rule].then.functionOptions = {
      ...ruleset.rules[rule].then.functionOptions,
      ...functionOptions,
    };
  }
  linter.setRuleset(ruleset);
  return linter;
}

// Loads the complete ruleset (all rules + custom functions) from the given file.
// Used by cross-cutting tests that must run every rule against a document.
async function fullLinterForRuleset(file = rulesetFile) {
  const linter = new Spectral();
  linter.setRuleset(await loadRuleset(file));
  return linter;
}

module.exports.linterForRule = linterForRule;
module.exports.fullLinterForRuleset = fullLinterForRuleset;
