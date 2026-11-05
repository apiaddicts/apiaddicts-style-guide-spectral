const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

const oar011fail = require('./OAR011/fail-example');
const oar011ok = require('./OAR011/ok-example');
const failConventions = require('./OAR011/fail-conventions');
const okNotEvaluated = require('./OAR011/ok-not-evaluated');
const okBasePathVersion = require('./OAR011/ok-base-path-version');
const failRefPathItems = require('./OAR011/fail-ref-path-items');

const K = 'kebab-case';
const S = 'snake_case';
const C = 'camelCase';
const U = 'UpperCamelCase';
const CONVENTIONS = [K, S, C, U];

const OK_BY_CONVENTION = {
  [K]: require('./OAR011/ok-kebab-case'),
  [S]: require('./OAR011/ok-snake-case'),
  [C]: require('./OAR011/ok-camel-case'),
  [U]: require('./OAR011/ok-upper-camel-case'),
};

const FAIL_CONVENTIONS = [
  [['basePath'], [S, C, U]],
  [['paths', '/customers'], [U]],
  [['paths', '/Customers'], [K, S, C]],
  [['paths', '/identity-documents'], [S, C, U]],
  [['paths', '/identity_documents'], [K, C, U]],
  [['paths', '/identityDocuments'], [K, S, U]],
  [['paths', '/IdentityDocuments'], [K, S, C]],
  [['paths', '/customers/{customerId}/oauth2Tokens'], [K, S, U]],
  [['paths', '/customers/Orders'], [K, S, C, U]],
  [['paths', '/documents/{documentId}.pdf'], [U]],
  [['paths', '/reports/v2.1/summary'], [U]],
  [['paths', '/{tenantId}'], []],
  [['paths', 'x-internalRoutes'], []],
];

const linterFor = (option) => linterForRule('apiq:OAR011', { functionOptions: { 'naming-convention': option } });
const reported = (results) => results.map((result) => result.path.join(' ')).sort();
const expectedFor = (table, convention) => table
  .filter(([, conventions]) => conventions.includes(convention))
  .map(([target]) => target.join(' '))
  .sort();

describe('apiq:OAR011 default kebab-case', () => {
  let linter;

  beforeAll(async () => {
    linter = await linterForRule('apiq:OAR011');
  });

  test('should find errors, the camelCase basePath included', async () => {
    const results = await linter.run(oar011fail);
    expect(results.length).toBe(8);
    expect(reported(results)).toContain('basePath');
    expect(results.find((result) => result.path[0] === 'basePath').message)
      .toBe("Value '/diversosBackend' does not follow the 'kebab-case' naming convention.");
  });

  test('should find no errors', async () => {
    expect((await linter.run(oar011ok)).length).toBe(0);
  });
});

describe('apiq:OAR011 Swagger 2.0 basePath', () => {
  test('the reported /onboarding/v1 base path complies with kebab-case, snake_case and camelCase', async () => {
    for (const convention of [K, S, C]) {
      // eslint-disable-next-line no-await-in-loop
      expect(await (await linterFor(convention)).run(okBasePathVersion)).toEqual([]);
    }
  });

  test('UpperCamelCase asks for /Onboarding/V1', async () => {
    const results = await (await linterFor(U)).run(okBasePathVersion);
    expect(reported(results)).toEqual(['basePath']);
    expect(results[0].message).toBe("Value '/onboarding/v1' does not follow the 'UpperCamelCase' naming convention.");
  });

  test('a camelCase basePath is reported under the default', async () => {
    const spec = { ...okBasePathVersion, basePath: '/customerOnboarding/v1' };
    expect(reported(await (await linterForRule('apiq:OAR011')).run(spec))).toEqual(['basePath']);
    expect(await (await linterFor(C)).run(spec)).toEqual([]);
  });

  test('a basePath of / or no basePath at all reports nothing', async () => {
    const { basePath, ...withoutBasePath } = okBasePathVersion;
    for (const convention of CONVENTIONS) {
      // eslint-disable-next-line no-await-in-loop
      const linter = await linterFor(convention);
      // eslint-disable-next-line no-await-in-loop
      expect(await linter.run({ ...okBasePathVersion, basePath: '/' })).toEqual([]);
      // eslint-disable-next-line no-await-in-loop
      expect(await linter.run(withoutBasePath)).toEqual([]);
    }
  });
});

describe('apiq:OAR011 Swagger 2.0 conventions', () => {
  test.each(CONVENTIONS)('reports exactly the %s column of the matrix', async (convention) => {
    const results = await (await linterFor(convention)).run(failConventions);
    expect(reported(results)).toEqual(expectedFor(FAIL_CONVENTIONS, convention));
    results.forEach((result) => expect(result.message).toContain(`'${convention}' naming convention`));
  });

  test.each(CONVENTIONS)('a document written in %s is compliant under that convention', async (convention) => {
    expect(await (await linterFor(convention)).run(OK_BY_CONVENTION[convention])).toEqual([]);
  });

  test.each(CONVENTIONS)('a document written in %s is reported under every other convention', async (convention) => {
    for (const other of CONVENTIONS.filter((candidate) => candidate !== convention)) {
      // eslint-disable-next-line no-await-in-loop
      const results = await (await linterFor(other)).run(OK_BY_CONVENTION[convention]);
      expect(results.length).toBeGreaterThan(0);
    }
  });

  test('accepts digits inside a camelCase word', async () => {
    const spec = {
      swagger: '2.0',
      info: { version: '1.0.0', title: 'Petstore' },
      host: 'api.example.com',
      basePath: '/',
      paths: { '/user2Profile': { get: { responses: { 200: { description: 'ok' } } } } },
    };
    expect(await (await linterFor(C)).run(spec)).toEqual([]);
  });

  test('accepts a two-word UpperCamelCase path', async () => {
    const spec = {
      swagger: '2.0',
      info: { version: '1.0.0', title: 'Petstore' },
      host: 'api.example.com',
      basePath: '/PetStore/V1',
      paths: { '/UserProfile': { get: { responses: { 200: { description: 'ok' } } } } },
    };
    expect(await (await linterFor(U)).run(spec)).toEqual([]);
  });

  test('respects a naming-convention functionOptions override', async () => {
    const results = await (await linterFor(S)).run(oar011ok);
    expect(results.length).toBe(6);
  });
});

describe('apiq:OAR011 Swagger 2.0 path items reached through $ref', () => {
  test.each([
    [K, ['/customers/{customerId}/orderHistory', '/customers/{customerId}/Orders']],
    [C, ['/customers/{customerId}/order-exports', '/customers/{customerId}/Orders']],
  ])('under %s each key is reported once, on its own line and not on the referenced definition', async (convention, keys) => {
    const text = JSON.stringify(failRefPathItems, null, 2);
    const lines = text.split('\n');
    const results = (await (await linterFor(convention)).run(new Document(text, Parsers.Json, 'fail-ref-path-items.json')))
      .filter((result) => result.code === 'apiq:OAR011');
    const keyLine = (key) => lines.findIndex((line) => line.startsWith(`    "${key}": `));
    const actual = results.map((result) => [result.path, result.range.start.line]).sort((a, b) => a[1] - b[1]);
    const expected = keys.map((key) => [['paths', key], keyLine(key)]).sort((a, b) => a[1] - b[1]);
    expect(expected.every(([, line]) => line > 0)).toBe(true);
    expect(actual).toEqual(expected);
  });
});

describe('apiq:OAR011 Swagger 2.0 parts of the document that are not URLs', () => {
  test.each(CONVENTIONS)('path extensions, parameter-only paths, the host and vendor extensions are ignored under %s', async (convention) => {
    expect(await (await linterFor(convention)).run(okNotEvaluated)).toEqual([]);
  });
});
