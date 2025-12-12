const { linterForRule } = require('../../helpers/utils');

const TESTS = [
  { pattern: 'camelCase', name: 'camel' },
  { pattern: 'snake_case', name: 'snake' },
  { pattern: 'kebab-case', name: 'kebab' },
  { pattern: 'upperCamelCase', name: 'upper-camel' },
];

TESTS.forEach(({ pattern, name }) => {
  let linter;

  const failExample = require(`./OAR012/fail-${name}-param`);
  const okExample = require(`./OAR012/ok-${name}-param`);

  beforeAll(async () => {
    linter = await linterForRule('apiq:OAR012', { pattern });
    return linter;
  });

  test(`apiq:OAR012 (${pattern}) should find errors`, () => {
    return linter.run(failExample).then((results) => {
      expect(results.length).toBeGreaterThanOrEqual(1);
    });
  });

  test(`apiq:OAR012 (${pattern}) should find no errors`, () => {
    return linter.run(okExample).then((results) => {
      expect(results.length).toBe(0);
    });
  });
});
