const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR121/fail-example');
const okExample = require('./OAR121/ok-example');
const failRefs = require('./OAR121/fail-refs');
const okRefs = require('./OAR121/ok-refs');
const failPathFilter = require('./OAR121/fail-path-filter');
const okPathFilter = require('./OAR121/ok-path-filter');
const okNotEvaluated = require('./OAR121/ok-not-evaluated');

const RULE = 'apiq:OAR121';
const DEFAULT_ALLOWED = 'oauth2, bearer';
const typeAt = (scheme, type, allowed = DEFAULT_ALLOWED) => [
  ['securityDefinitions', scheme, 'type'],
  `OAR121: Security scheme '${scheme}' type '${type}' is not allowed. Allowed types: ${allowed}.`,
];

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

let linter;
const linters = new Map();
const withOptions = async (functionOptions) => {
  const key = JSON.stringify(functionOptions);
  if (!linters.has(key)) linters.set(key, await linterForRule(RULE, { functionOptions }));
  return linters.get(key);
};
const findings = async (document, functionOptions) => {
  const custom = functionOptions === undefined ? linter : await withOptions(functionOptions);
  return sorted((await custom.run(document)).filter((r) => r.code === RULE).map((r) => [r.path, r.message]));
};

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR121 - Swagger 2.0', () => {
  test('flags basic and apiKey definitions with the default list, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      typeAt('StaffBasic', 'basic'),
      typeAt('LegacyBasic', 'Basic'),
      typeAt('ClinicKey', 'apiKey'),
    ]));
  });

  test('accepts oauth2 definitions in any case', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('basic is allowed by basic or by http, never by bearer', async () => {
    expect(await findings(failExample, { 'allowed-security-types': 'oauth2,basic' })).toEqual([typeAt('ClinicKey', 'apiKey', 'oauth2, basic')]);
    expect(await findings(failExample, { 'allowed-security-types': 'oauth2,HTTP' })).toEqual([typeAt('ClinicKey', 'apiKey', 'oauth2, HTTP')]);
    expect(await findings(failExample, { 'allowed-security-types': 'apiKey,bearer' })).toEqual(sorted([
      typeAt('VetAccessCode', 'oauth2', 'apiKey, bearer'),
      typeAt('ClinicApp', 'oauth2', 'apiKey, bearer'),
      typeAt('StaffBasic', 'basic', 'apiKey, bearer'),
      typeAt('LegacyBasic', 'Basic', 'apiKey, bearer'),
    ]));
  });

  test('follows chained $refs in securityDefinitions and refs out of them', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      typeAt('OwnerBasicBase', 'basic'),
      typeAt('SharedKey', 'apiKey'),
    ]));
  });

  test('ignores circular, dangling and undeclared references', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('skips the definitions applied only to the default excluded paths, matched exactly', async () => {
    expect(await findings(failPathFilter)).toEqual(sorted([
      typeAt('StatusKey', 'apiKey'),
      typeAt('MyPetsKey', 'apiKey'),
      typeAt('VisitsKey', 'apiKey'),
      typeAt('UnusedKey', 'apiKey'),
    ]));
    expect(await findings(failPathFilter, { paths: '/health', pathValidationStrategy: '/include' })).toEqual([typeAt('MonitoringKey', 'apiKey')]);
  });

  test('root security inherited only by excluded paths, security: [] and anonymous alternatives report nothing', async () => {
    expect(await findings(okPathFilter)).toEqual([]);
    expect(await findings(okPathFilter, { paths: '' })).toEqual(sorted([
      typeAt('MonitoringBasic', 'basic'),
      typeAt('MeKey', 'apiKey'),
    ]));
  });

  test('ignores definitions without a usable type', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });
});
