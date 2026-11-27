const { linterForRule } = require('../../helpers/utils');

const oar099fail = require('./OAR099/fail-example');
const oar099ok = require('./OAR099/ok-example');
const failServerUrls = require('./OAR099/fail-server-urls');
const okServerUrls = require('./OAR099/ok-server-urls');
const failServerUrls31 = require('./OAR099/fail-server-urls-31');
const okServerUrls31 = require('./OAR099/ok-server-urls-31');
const failServerUrls320 = require('./OAR099/fail-server-urls-320');
const okServerUrls320 = require('./OAR099/ok-server-urls-320');
const okNotEvaluated = require('./OAR099/ok-not-evaluated');
const failRefs = require('./OAR099/fail-refs');
const okRefs = require('./OAR099/ok-refs');

const RULE = 'apiq:OAR099';
const MESSAGE = "OAR099: API name must start with prefix 'api-'.";

const clone = (value) => JSON.parse(JSON.stringify(value));
const serverUrl = (index) => ['servers', String(index), 'url'];

let linter;
const findings = async (document) => (await linter.run(document)).filter((r) => r.code === RULE);
const paths = async (document) => (await findings(document)).map((r) => r.path.map(String));

const withServers = (openapi, urls) => ({
  openapi,
  info: { title: 'Accounts API', version: '1.0.0' },
  servers: urls.map((url) => ({ url })),
  paths: {
    '/status': { get: { responses: { 200: { description: 'Up' } } } },
    '/accounts': { get: { responses: { 200: { description: 'Accounts' } } } },
  },
});

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

test('apiq:OAR099 should find errors', () => {
  return linter.run(oar099fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR099 should find no errors', () => {
  return linter.run(oar099ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

describe('OAR099 on OpenAPI 3.0 server URLs', () => {
  test('reports every server whose first path segment does not start with api- followed by a name', async () => {
    const results = await findings(failServerUrls);
    expect(results.map((r) => r.path.map(String))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(serverUrl));
    results.forEach((r) => expect(r.message).toBe(MESSAGE));
  });

  test('accepts any scheme, host, port, variables, query or fragment around a prefixed first segment', async () => {
    expect(await findings(okServerUrls)).toEqual([]);
  });

  test('does not evaluate path keys, path or operation servers, links, callbacks or extensions', async () => {
    expect(await findings(okNotEvaluated)).toEqual([]);
  });

  test('the reported API Product Scoring document with /status paths is compliant', async () => {
    expect(okNotEvaluated.servers[0].url).toBe('https://api-gw.apiquality.io/api-product-scoring/v1');
    expect(Object.keys(okNotEvaluated.paths)).toContain('/status');
    expect(await findings(okNotEvaluated)).toEqual([]);
  });

  test('a path key without the prefix is never reported, whatever the server says', async () => {
    const document = clone(okNotEvaluated);
    document.servers = [{ url: 'https://gateway.apiquality.io/product-scoring/v1' }];
    expect(await paths(document)).toEqual([serverUrl(0)]);
  });

  test('a document without servers has nothing to check', async () => {
    const document = clone(okNotEvaluated);
    delete document.servers;
    expect(await findings(document)).toEqual([]);
  });

  test('an empty servers list has nothing to check', async () => {
    const document = clone(okNotEvaluated);
    document.servers = [];
    expect(await findings(document)).toEqual([]);
  });

  test('servers without a string url are ignored', async () => {
    const document = withServers('3.0.3', []);
    document.servers = [{ description: 'No url' }, { url: null }, { url: 8080 }, { url: true }, { url: ['https://a.example.com/x'] }, { url: { href: 'x' } }];
    expect(await findings(document)).toEqual([]);
  });
});

describe('OAR099 on OpenAPI 3.1 server URLs', () => {
  test('reports root servers only, never webhooks or components.pathItems servers', async () => {
    expect(await paths(failServerUrls31)).toEqual([1, 2, 3, 4, 5, 6, 7].map(serverUrl));
  });

  test('a compliant document with nullable array types, webhooks and path item refs reports nothing', async () => {
    expect(await findings(okServerUrls31)).toEqual([]);
  });
});

describe('OAR099 on OpenAPI 3.2 server URLs', () => {
  test('reports root servers only, never query or additionalOperations servers', async () => {
    expect(await paths(failServerUrls320)).toEqual([1, 2, 3, 4].map(serverUrl));
  });

  test('a compliant document with named servers and new 3.2 operations reports nothing', async () => {
    expect(await findings(okServerUrls320)).toEqual([]);
  });
});

describe('OAR099 with $ref servers', () => {
  test('a server reached through a $ref or a chained $ref is evaluated with the referenced url', async () => {
    expect(await paths(failRefs)).toEqual([serverUrl(1), serverUrl(2)]);
  });

  test('referenced servers with the prefix and unreferenced definitions report nothing', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });
});

describe.each([['3.0.3'], ['3.1.0'], ['3.2.0']])('OAR099 server URL cases in OpenAPI %s', (openapi) => {
  test.each([
    'https://accounts.example.com/api-accounts/v1',
    'https://accounts.example.com/api-accounts',
    'https://accounts.example.com/api-accounts/internal/v2',
    'https://accounts.example.com/api-a',
    'https://api-accounts.example.com/api-accounts/v1',
    'http://localhost:3000/api-accounts/v1',
    '{scheme}://accounts.example.com/api-accounts/v1',
    'https://{tenant}.accounts.example.com/api-accounts/v1',
    'https://accounts.example.com/api-{product}/v1',
    '/api-accounts/v1',
    '//accounts.example.com/api-accounts/v1',
    'https://accounts.example.com/api-accounts?locale=es',
    'https://accounts.example.com/api-accounts#top',
  ])('%s is compliant', async (url) => {
    expect(await findings(withServers(openapi, [url]))).toEqual([]);
  });

  test.each([
    'https://accounts.example.com/accounts/v1',
    'https://api-accounts.example.com/accounts/v1',
    'https://accounts.example.com/v1/api-accounts',
    'https://accounts.example.com/core/api-accounts/v1',
    'https://accounts.example.com/api-',
    'https://accounts.example.com/api-/v1',
    'https://accounts.example.com/API-accounts/v1',
    'https://accounts.example.com/Api-accounts/v1',
    'https://accounts.example.com/apiaccounts/v1',
    'https://accounts.example.com/api_accounts/v1',
    'https://accounts.example.com/api.accounts/v1',
    'https://accounts.example.com',
    'https://accounts.example.com/',
    'https://accounts.example.com?x=api-accounts',
    'https://accounts.example.com//api-accounts/v1',
    'https://accounts.example.com/{apiName}/v1',
    'accounts.example.com/api-accounts/v1',
    'localhost:3000/api-accounts/v1',
    'api-accounts/v1',
    '/accounts/v1',
    '/',
    '',
  ])('%s is reported once', async (url) => {
    expect(await paths(withServers(openapi, [url]))).toEqual([serverUrl(0)]);
  });
});

describe('OAR099 on very large documents', () => {
  const PATH_COUNT = 4000;
  const SERVER_COUNT = 600;

  const largeDocument = (openapi, badEvery) => {
    const document = withServers(openapi, []);
    document.servers = Array.from({ length: SERVER_COUNT }, (_, index) => ({
      url: badEvery && index % badEvery === 0
        ? `https://region-${index}.example.com/accounts-${index}/v1`
        : `https://region-${index}.example.com/api-accounts-${index}/v1`,
    }));
    document.paths = {};
    for (let index = 0; index < PATH_COUNT; index += 1) {
      document.paths[`/tenants/{tenantId}/accounts-${index}/{accountId}`] = {
        servers: [{ url: `https://shard-${index}.example.com/shard/v1` }],
        get: { responses: { 200: { description: 'Account' } } },
      };
    }
    return document;
  };

  test.each([['3.0.3'], ['3.1.0'], ['3.2.0']])('%s: thousands of unprefixed paths and path servers report nothing', async (openapi) => {
    expect(await findings(largeDocument(openapi, 0))).toEqual([]);
  });

  test.each([['3.0.3'], ['3.1.0'], ['3.2.0']])('%s: only the unprefixed root servers are reported', async (openapi) => {
    const expected = Array.from({ length: SERVER_COUNT }, (_, index) => index).filter((index) => index % 7 === 0).map(serverUrl);
    expect(await paths(largeDocument(openapi, 7))).toEqual(expected);
  });
});
