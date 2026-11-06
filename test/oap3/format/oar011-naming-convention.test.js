const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

const oar011fail = require('./OAR011/fail-example');
const oar011ok = require('./OAR011/ok-example');
const failConventions = require('./OAR011/fail-conventions');
const failConventions31 = require('./OAR011/fail-conventions-31');
const failConventions320 = require('./OAR011/fail-conventions-320');
const okServerUrls = require('./OAR011/ok-server-urls');
const failServerUrls = require('./OAR011/fail-server-urls');
const okNotEvaluated31 = require('./OAR011/ok-not-evaluated-31');
const okNotEvaluated320 = require('./OAR011/ok-not-evaluated-320');
const failRefPathItems = require('./OAR011/fail-ref-path-items');
const failRefPathItems31 = require('./OAR011/fail-ref-path-items-31');
const failRefPathItems320 = require('./OAR011/fail-ref-path-items-320');

const K = 'kebab-case';
const S = 'snake_case';
const C = 'camelCase';
const U = 'UpperCamelCase';
const CONVENTIONS = [K, S, C, U];

const OK_BY_CONVENTION = {
  [K]: 'kebab-case',
  [S]: 'snake-case',
  [C]: 'camel-case',
  [U]: 'upper-camel-case',
};

const FAIL_CONVENTIONS = [
  [['servers', 0, 'url'], [U]],
  [['servers', 1, 'url'], [S, C, U]],
  [['servers', 2, 'url'], [K, C, U]],
  [['servers', 3, 'url'], [K, S, U]],
  [['servers', 4, 'url'], [K, S, C]],
  [['servers', 5, 'url'], []],
  [['paths', '/customers'], [U]],
  [['paths', '/Customers'], [K, S, C]],
  [['paths', '/identity-documents'], [S, C, U]],
  [['paths', '/identity_documents'], [K, C, U]],
  [['paths', '/identityDocuments'], [K, S, U]],
  [['paths', '/IdentityDocuments'], [K, S, C]],
  [['paths', '/customers/{customerId}/oauth2Tokens'], [K, S, U]],
  [['paths', '/customers/Orders'], [K, S, C, U]],
  [['paths', '/customerID'], [K, S, C, U]],
  [['paths', '/{tenantId}'], []],
  [['paths', '/documents/{documentId}.pdf'], [U]],
  [['paths', '/Documents/{DocumentId}.pdf'], [K, S, C]],
  [['paths', '/reports/v2.1/summary'], [U]],
  [['paths', '/users/{userId}:activate'], [K, S, C, U]],
  [['paths', '/payment-methods/{paymentMethodId}/card_details'], [K, S, C, U]],
  [['paths', '/.well-known/openid-configuration'], [S, C, U]],
  [['paths', '/2024/statements'], [U]],
  [['paths', 'x-internalRoutes'], []],
];

const FAIL_CONVENTIONS_31 = [
  [['servers', 0, 'url'], [U]],
  [['servers', 1, 'url'], [S, C, U]],
  [['servers', 2, 'url'], [K, S, U]],
  [['servers', 3, 'url'], [K, S, C]],
  [['servers', 4, 'url'], []],
  [['paths', '/payments'], [U]],
  [['paths', '/payments/{paymentId}/refundRequests'], [K, S, U]],
  [['paths', '/payments/{paymentId}/refunds'], [U]],
  [['paths', '/payment_links'], [K, C, U]],
  [['paths', '/PaymentLinks/{LinkId}'], [K, S, C]],
  [['paths', '/payments/{paymentId}/receipt.pdf'], [U]],
  [['paths', '/payments/{paymentId}/Receipt.PDF'], [K, S, C, U]],
  [['paths', '/settlements/v2.0/dailyReports'], [K, S, U]],
];

const FAIL_CONVENTIONS_320 = [
  [['servers', 0, 'url'], [S, C, U]],
  [['servers', 1, 'url'], [K, S, U]],
  [['servers', 2, 'url'], [K, S, C]],
  [['servers', 3, 'url'], [K, C, U]],
  [['servers', 4, 'url'], []],
  [['paths', '/vehicles'], [U]],
  [['paths', '/vehicles/{vehicleId}/gpsPositions'], [K, S, U]],
  [['paths', '/vehicles/{vehicleId}/gps-positions'], [S, C, U]],
  [['paths', '/vehicles/{vehicleId}/gps_positions'], [K, C, U]],
  [['paths', '/Vehicles/{VehicleId}/GpsPositions'], [K, S, C]],
  [['paths', '/vehicles/{vehicleId}/telemetry.csv'], [U]],
  [['paths', '/drivers/{driverId}/licenceV2'], [K, S, U]],
  [['paths', '/fleet/HTTPEvents'], [K, S, C, U]],
];

const OK_SERVER_URLS = [
  [['servers', 0, 'url'], []],
  [['servers', 1, 'url'], []],
  [['servers', 2, 'url'], [U]],
  [['servers', 3, 'url'], []],
  [['servers', 4, 'url'], [U]],
  [['servers', 5, 'url'], [U]],
  [['servers', 6, 'url'], [U]],
  [['servers', 7, 'url'], [U]],
  [['servers', 8, 'url'], [U]],
  [['servers', 9, 'url'], [U]],
  [['servers', 10, 'url'], [U]],
  [['servers', 11, 'url'], [U]],
  [['servers', 12, 'url'], []],
  [['servers', 13, 'url'], [U]],
];

const FAIL_SERVER_URLS = [
  [['servers', 0, 'url'], [K, S, U]],
  [['servers', 1, 'url'], [K, S, C, U]],
  [['servers', 2, 'url'], [K, C, U]],
  [['servers', 3, 'url'], [K, S, C]],
  [['servers', 4, 'url'], [K, S, U]],
  [['servers', 5, 'url'], [K, S, C, U]],
  [['servers', 6, 'url'], [K, S, C]],
  [['servers', 7, 'url'], [K, S, C, U]],
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

  test('should find errors', async () => {
    expect((await linter.run(oar011fail)).length).toBe(14);
  });

  test('should find no errors', async () => {
    expect((await linter.run(oar011ok)).length).toBe(0);
  });

  test('the shipped default reports exactly the kebab-case column of every matrix', async () => {
    expect(reported(await linter.run(failConventions))).toEqual(expectedFor(FAIL_CONVENTIONS, K));
    expect(reported(await linter.run(failConventions31))).toEqual(expectedFor(FAIL_CONVENTIONS_31, K));
    expect(reported(await linter.run(failConventions320))).toEqual(expectedFor(FAIL_CONVENTIONS_320, K));
  });

  test('the message quotes the whole value and the convention', async () => {
    const results = await linter.run(failConventions);
    const server = results.find((result) => result.path.join(' ') === 'servers 2 url');
    expect(server.code).toBe('apiq:OAR011');
    expect(server.message).toBe("Value 'https://api.example.com/customer_onboarding/v2' does not follow the 'kebab-case' naming convention.");
  });
});

describe('apiq:OAR011 reported case: camelCase with a version as the last base path segment', () => {
  const okCamelCase = require('./OAR011/ok-camel-case');

  test('the Heytrade server URLs ending in /onboarding/v1 are not reported under camelCase', async () => {
    const results = await (await linterFor(C)).run(okCamelCase);
    expect(okCamelCase.servers.slice(0, 3).map((server) => server.url)).toEqual([
      'https://api-dev.heytrade.com/onboarding/v1',
      'https://api-pre.heytrade.com/onboarding/v1',
      'https://api.heytrade.com/onboarding/v1',
    ]);
    expect(results).toEqual([]);
  });

  test('the same URLs comply with kebab-case and snake_case, and only UpperCamelCase asks for V1', async () => {
    const onboardingServers = ['servers 0 url', 'servers 1 url', 'servers 2 url'];
    for (const convention of [K, S]) {
      // eslint-disable-next-line no-await-in-loop
      const results = reported(await (await linterFor(convention)).run(okCamelCase));
      expect(results.filter((target) => onboardingServers.includes(target))).toEqual([]);
    }
    const upper = await (await linterFor(U)).run(okCamelCase);
    expect(reported(upper).filter((target) => onboardingServers.includes(target))).toEqual(onboardingServers);
    expect(upper.find((result) => result.path.join(' ') === 'servers 0 url').message)
      .toBe("Value 'https://api-dev.heytrade.com/onboarding/v1' does not follow the 'UpperCamelCase' naming convention.");
  });

  test('digits inside a camelCase word are accepted', async () => {
    const spec = {
      openapi: '3.0.3',
      info: { title: 'Accounts API', version: '1.0.0' },
      paths: {
        '/user2Profile': { get: { responses: { 200: { description: 'ok' } } } },
        '/accounts/{accountId}/oauth2Clients/v3': { get: { responses: { 200: { description: 'ok' } } } },
      },
    };
    expect(await (await linterFor(C)).run(spec)).toEqual([]);
  });
});

describe.each([
  ['OpenAPI 3.0', '', failConventions, FAIL_CONVENTIONS],
  ['OpenAPI 3.1', '-31', failConventions31, FAIL_CONVENTIONS_31],
  ['OpenAPI 3.2', '-320', failConventions320, FAIL_CONVENTIONS_320],
])('apiq:OAR011 %s', (label, suffix, failFixture, table) => {
  test.each(CONVENTIONS)('reports exactly the %s column of the matrix', async (convention) => {
    const results = await (await linterFor(convention)).run(failFixture);
    expect(reported(results)).toEqual(expectedFor(table, convention));
    results.forEach((result) => expect(result.message).toContain(`'${convention}' naming convention`));
  });

  test.each(CONVENTIONS)('a document written in %s is compliant under that convention', async (convention) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const okFixture = require(`./OAR011/ok-${OK_BY_CONVENTION[convention]}${suffix}`);
    expect(await (await linterFor(convention)).run(okFixture)).toEqual([]);
  });

  test.each(CONVENTIONS)('a document written in %s is reported under every other convention', async (convention) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const okFixture = require(`./OAR011/ok-${OK_BY_CONVENTION[convention]}${suffix}`);
    for (const other of CONVENTIONS.filter((candidate) => candidate !== convention)) {
      // eslint-disable-next-line no-await-in-loop
      expect((await (await linterFor(other)).run(okFixture)).length).toBeGreaterThan(0);
    }
  });
});

describe('apiq:OAR011 segments', () => {
  test('a non-compliant segment is reported even when gluing it to its neighbour would comply', async () => {
    expect(reported(await (await linterFor(C)).run(failConventions))).toContain('paths /customers/Orders');
  });

  test('UpperCamelCase accepts multi-word names and versions written V1', async () => {
    const spec = {
      openapi: '3.0.3',
      info: { title: 'Accounts API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com/CustomerAccounts/V2.1' }],
      paths: {
        '/UserProfile': { get: { responses: { 200: { description: 'ok' } } } },
        '/UserProfiles/{ProfileId}/AvatarImage.png': { get: { responses: { 200: { description: 'ok' } } } },
      },
    };
    expect(await (await linterFor(U)).run(spec)).toEqual([]);
  });

  test('paths made only of parameters have no literal segment to check', async () => {
    const spec = {
      openapi: '3.0.3',
      info: { title: 'Tenants API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }, { url: 'https://api.example.com/' }, { url: '/' }],
      paths: {
        '/': { get: { responses: { 200: { description: 'ok' } } } },
        '/{tenantId}': { get: { responses: { 200: { description: 'ok' } } } },
        '/{tenantId}/{userId}/': { get: { responses: { 200: { description: 'ok' } } } },
      },
    };
    for (const convention of CONVENTIONS) {
      // eslint-disable-next-line no-await-in-loop
      expect(await (await linterFor(convention)).run(spec)).toEqual([]);
    }
  });
});

describe('apiq:OAR011 server URLs', () => {
  test.each(CONVENTIONS)('only the path of each URL form is checked under %s', async (convention) => {
    expect(reported(await (await linterFor(convention)).run(okServerUrls))).toEqual(expectedFor(OK_SERVER_URLS, convention));
  });

  test.each(CONVENTIONS)('non-compliant paths are found behind every URL form under %s', async (convention) => {
    expect(reported(await (await linterFor(convention)).run(failServerUrls))).toEqual(expectedFor(FAIL_SERVER_URLS, convention));
  });
});

describe.each([
  ['OpenAPI 3.0, referenced from a vendor extension', failRefPathItems],
  ['OpenAPI 3.1, chained through components.pathItems', failRefPathItems31],
  ['OpenAPI 3.2, with additionalOperations in the target', failRefPathItems320],
])('apiq:OAR011 path items reached through $ref, %s', (label, fixture) => {
  const located = async (convention) => {
    const text = JSON.stringify(fixture, null, 2);
    const results = await (await linterFor(convention)).run(new Document(text, Parsers.Json, 'fail-ref-path-items.json'));
    return { lines: text.split('\n'), results: results.filter((result) => result.code === 'apiq:OAR011') };
  };
  const keyLine = (lines, key) => lines.findIndex((line) => line.startsWith(`    "${key}": `));

  test.each([
    [K, ['/customers/{customerId}/orderHistory', '/customers/{customerId}/Orders']],
    [C, ['/customers/{customerId}/order-exports', '/customers/{customerId}/Orders']],
  ])('under %s each key is reported once, on its own line and not on the referenced definition', async (convention, keys) => {
    const { lines, results } = await located(convention);
    const actual = results.map((result) => [result.path, result.range.start.line]).sort((a, b) => a[1] - b[1]);
    const expected = keys.map((key) => [['paths', key], keyLine(lines, key)]).sort((a, b) => a[1] - b[1]);
    expect(expected.every(([, line]) => line > 0)).toBe(true);
    expect(actual).toEqual(expected);
  });
});

describe('apiq:OAR011 parts of the document that are not URLs', () => {
  test.each(CONVENTIONS)('webhooks, callbacks, links, components, extensions and variable-only servers are ignored under %s (3.1)', async (convention) => {
    expect(await (await linterFor(convention)).run(okNotEvaluated31)).toEqual([]);
  });

  test.each(CONVENTIONS)('$self, server names and additionalOperations are ignored under %s (3.2)', async (convention) => {
    expect(await (await linterFor(convention)).run(okNotEvaluated320)).toEqual([]);
  });
});

describe('apiq:OAR011 naming-convention option values', () => {
  test.each([
    [' camelCase ', C],
    ['CAMELCASE', C],
    ['camelcase', C],
    ['UPPERCAMELCASE', U],
    ['upperCamelCase', U],
    ['Snake_Case', S],
    ['KEBAB-CASE', K],
  ])('%j is read as %s, trimmed and case-insensitively', async (option, convention) => {
    const results = await (await linterFor(option)).run(failConventions);
    expect(reported(results)).toEqual(expectedFor(FAIL_CONVENTIONS, convention));
    results.forEach((result) => expect(result.message).toContain(`'${convention}' naming convention`));
  });

  test.each([
    ['PascalCase'],
    ['lowerCamelCase'],
    ['SCREAMING_SNAKE_CASE'],
    [''],
    ['   '],
    [null],
    [42],
    [true],
    [{}],
    [['camelCase']],
  ])('%j falls back to the kebab-case default instead of disabling the rule', async (option) => {
    const results = await (await linterFor(option)).run(failConventions);
    expect(reported(results)).toEqual(expectedFor(FAIL_CONVENTIONS, K));
    results.forEach((result) => expect(result.message).toContain("'kebab-case' naming convention"));
  });

  test('respects a naming-convention functionOptions override', async () => {
    const results = await (await linterFor(S)).run(oar011ok);
    expect(results.length).toBe(8);
  });
});

describe('apiq:OAR011 large documents', () => {
  const largeSpec = (count) => {
    const paths = {};
    for (let i = 0; i < count; i += 1) {
      const resource = i % 2 === 0 ? `/catalog-items-${i}/{itemId}/price-history` : `/catalogItems${i}/{itemId}/priceHistory`;
      paths[resource] = { get: { operationId: `operation${i}`, responses: { 200: { description: 'ok' } } } };
    }
    const servers = [];
    for (let i = 0; i < 50; i += 1) {
      servers.push({ url: i % 2 === 0 ? `https://region-${i}.example.com/catalog/v${i}` : `https://region-${i}.example.com/productCatalog/v${i}` });
    }
    return { openapi: '3.1.0', info: { title: 'Product Catalog API', version: '1.0.0' }, servers, paths };
  };

  test('a 2,000-path document reports every odd path and server under kebab-case and every even one under camelCase', async () => {
    const spec = largeSpec(2000);
    expect((await (await linterFor(K)).run(spec)).length).toBe(1000 + 25);
    expect((await (await linterFor(C)).run(spec)).length).toBe(1000);
  });

  test('a 10,000-path document is checked in a reasonable time', async () => {
    const spec = largeSpec(10000);
    const started = Date.now();
    const results = await (await linterFor(K)).run(spec);
    expect(results.length).toBe(5000 + 25);
    expect(Date.now() - started).toBeLessThan(60000);
  }, 120000);
});
