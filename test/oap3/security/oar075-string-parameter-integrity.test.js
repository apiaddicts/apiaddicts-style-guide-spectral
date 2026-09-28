const { linterForRule } = require('../../helpers/utils');

let linter;

const oar075fail = require('./OAR075/fail-example');
const oar075ok = require('./OAR075/ok-example');
const oar075failArray = require('./OAR075/fail-array-type-31');
const oar075okArray = require('./OAR075/ok-array-type-31');
const oar075failFormat = require('./OAR075/fail-format-exemption');
const oar075okFormat = require('./OAR075/ok-format-exemption');
const oar075failFormatArray = require('./OAR075/fail-format-exemption-31');
const oar075okFormatArray = require('./OAR075/ok-format-exemption-31');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR075');
  return linter;
});

test('apiq:OAR075 should find errors', () => {
  return linter.run(oar075fail).then((results) => {
    expect(results.length).toBe(6);
  });
});

test('apiq:OAR075 should find no errors', () => {
  return linter.run(oar075ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR075 should find errors with an array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar075failArray).then((results) => {
    expect(results.length).toBe(4);
  });
});

test('apiq:OAR075 should find no errors with a compliant array-form type (OpenAPI 3.1)', () => {
  return linter.run(oar075okArray).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR075 should find errors when the format is not self-constrained', () => {
  return linter.run(oar075failFormat).then((results) => {
    expect(results.length).toBe(13);
  });
});

test('apiq:OAR075 should find no errors when the format is self-constrained', () => {
  return linter.run(oar075okFormat).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('apiq:OAR075 should find errors with an array-form type and a non-exempt format (OpenAPI 3.1)', () => {
  return linter.run(oar075failFormatArray).then((results) => {
    expect(results.length).toBe(4);
  });
});

test('apiq:OAR075 should find no errors with an array-form type and a self-constrained format (OpenAPI 3.1)', () => {
  return linter.run(oar075okFormatArray).then((results) => {
    expect(results.length).toBe(0);
  });
});

describe('parameter_integrity, the same option key Sonar exposes as a @RuleProperty', () => {
  test('restricting it to "pattern" reports everything that has no pattern', async () => {
    const patternOnly = await linterForRule('apiq:OAR075', {
      functionOptions: { parameter_integrity: 'pattern' },
    });
    const results = await patternOnly.run(oar075ok);
    expect(results.length).toBe(4);
  });

  test('keys are trimmed, so spacing in the configured list does not matter', async () => {
    const spaced = await linterForRule('apiq:OAR075', {
      functionOptions: { parameter_integrity: '  minLength ,  maxLength , pattern ,enum  ' },
    });
    const results = await spaced.run(oar075ok);
    expect(results.length).toBe(0);
  });

  test('an empty list can never be satisfied', async () => {
    const empty = await linterForRule('apiq:OAR075', {
      functionOptions: { parameter_integrity: '' },
    });
    const results = await empty.run(oar075ok);
    expect(results.length).toBe(5);
  });

  test('a self-constrained format survives a narrowed parameter_integrity', async () => {
    const patternOnly = await linterForRule('apiq:OAR075', {
      functionOptions: { parameter_integrity: 'pattern' },
    });
    const results = await patternOnly.run(oar075okFormat);
    expect(results.length).toBe(0);
  });

  test('a self-constrained format survives an empty parameter_integrity', async () => {
    const empty = await linterForRule('apiq:OAR075', {
      functionOptions: { parameter_integrity: '' },
    });
    const results = await empty.run(oar075okFormat);
    expect(results.length).toBe(1);
  });

  test('adding format to the list makes any format satisfy the rule, exempt or not', async () => {
    const withFormat = await linterForRule('apiq:OAR075', {
      functionOptions: { parameter_integrity: 'minLength,maxLength,pattern,enum,format' },
    });
    const results = await withFormat.run(oar075failFormat);
    expect(results.length).toBe(1);
  });
});
