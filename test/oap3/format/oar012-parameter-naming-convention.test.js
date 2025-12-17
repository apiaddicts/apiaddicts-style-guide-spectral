const { linterForRule } = require('../../helpers/utils');

const TESTS = [
  { namingConvention: 'camelCase', name: 'camel' },
  { namingConvention: 'snake_case', name: 'snake' },
  { namingConvention: 'kebab-case', name: 'kebab' },
  { namingConvention: 'UpperCamelCase', name: 'upper-camel' },
];

TESTS.forEach(({ namingConvention, name }) => {
  let linter;

  const failExample = require(`./OAR012/fail-${name}-param`);
  const okExample = require(`./OAR012/ok-${name}-param`);

  beforeAll(async () => {
    linter = await linterForRule('apiq:OAR012', { namingConvention });
    return linter;
  });

  test(`apiq:OAR012 (${namingConvention}) should find errors`, async () => {
    const results = await linter.run(failExample);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test(`apiq:OAR012 (${namingConvention}) should find no errors`, async () => {
    const results = await linter.run(okExample);
    expect(results.length).toBe(0);
  });
});
