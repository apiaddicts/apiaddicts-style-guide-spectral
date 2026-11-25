const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR122/fail-example');
const okExample = require('./OAR122/ok-example');

const RULE = 'apiq:OAR122';
const HOST_MISSING = 'OAR122: The host must be defined.';
const HOST_FORMAT = 'OAR122: The host must be a host name with an optional port, without scheme or path.';
const SCHEME = 'OAR122: Server scheme must be http or https.';
const BASE_PATH = "OAR122: The basePath must start with '/'.";

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const clone = (value) => JSON.parse(JSON.stringify(value));
const withField = (field, value) => {
  const document = clone(okExample);
  if (value === undefined) delete document[field];
  else document[field] = value;
  return document;
};

let linter;
const findings = async (document) => sorted((await linter.run(document)).filter((r) => r.code === RULE).map((r) => [r.path, r.message]));

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR122 - OpenAPI 2.0', () => {
  test('the ticket example in Swagger 2.0: an http upstream host with its basePath is compliant', async () => {
    expect(await findings({
      swagger: '2.0',
      info: { title: 'Greetings API', version: '1.0.0' },
      host: 'greetings-service:8080',
      schemes: ['http'],
      basePath: '/api-greetings/v1',
      paths: { '/greetings': { get: { responses: { 200: { description: 'Ok' } } } } },
    })).toEqual([]);
  });

  test('flags a host with scheme, every scheme other than http or https and a basePath without leading slash, as errors', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted([
      [['host'], HOST_FORMAT],
      [['schemes', '1'], SCHEME],
      [['schemes', '2'], SCHEME],
      [['schemes', '3'], SCHEME],
      [['schemes', '4'], SCHEME],
      [['basePath'], BASE_PATH],
    ]));
  });

  test('accepts a host with port, http and https schemes and a basePath; operation schemes are not evaluated', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('a document without host is reported once, on the document', async () => {
    expect(await findings(withField('host', undefined))).toEqual([[[], HOST_MISSING]]);
  });

  test.each([
    ['an empty string', ''],
    ['blank', '   '],
    ['null', null],
    ['a number', 8080],
    ['a list', ['fleet.example.com']],
    ['an object', { name: 'fleet.example.com' }],
  ])('host as %s is reported as not defined', async (name, host) => {
    expect(await findings(withField('host', host))).toEqual([[['host'], HOST_MISSING]]);
  });

  test.each([
    ['fleet.example.com', true],
    ['FLEET.EXAMPLE.COM', true],
    ['fleet-service', true],
    ['fleet.example.com:8443', true],
    ['localhost:3000', true],
    ['10.0.0.4:8080', true],
    ['[2001:db8::1]:8443', true],
    ['https://fleet.example.com', false],
    ['//fleet.example.com', false],
    ['fleet.example.com/api-fleet/v1', false],
    ['fleet.example.com?tenant=acme', false],
    ['fleet.example.com#maintenance', false],
    ['mechanic@fleet.example.com', false],
    ['{tenant}.fleet.example.com', false],
    ['fleet example.com', false],
    [' fleet.example.com', false],
    ['fleet.example.com:99999', false],
    ['fleet.example.com:http', false],
    ['fleet.example.com\\api', false],
  ])('host %j compliant: %s', async (host, compliant) => {
    expect(await findings(withField('host', host))).toEqual(compliant ? [] : [[['host'], HOST_FORMAT]]);
  });

  test.each([
    ['absent', undefined, []],
    ['an empty list', [], []],
    ['a string instead of a list', 'wss', []],
    ['http', ['http'], []],
    ['https', ['https'], []],
    ['http and https', ['https', 'http'], []],
    ['ws', ['ws'], [[['schemes', '0'], SCHEME]]],
    ['wss after https', ['https', 'wss'], [[['schemes', '1'], SCHEME]]],
    ['uppercase', ['HTTP', 'Https'], [[['schemes', '0'], SCHEME], [['schemes', '1'], SCHEME]]],
    ['padded', [' https'], [[['schemes', '0'], SCHEME]]],
    ['null and numbers', [null, 443], [[['schemes', '0'], SCHEME], [['schemes', '1'], SCHEME]]],
  ])('schemes %s', async (name, schemes, expected) => {
    expect(await findings(withField('schemes', schemes))).toEqual(sorted(expected));
  });

  test.each([
    ['absent', undefined, []],
    ['/', '/', []],
    ['/api-fleet/v1', '/api-fleet/v1', []],
    ['/api-fleet/v1/', '/api-fleet/v1/', []],
    ['without leading slash', 'api-fleet/v1', [[['basePath'], BASE_PATH]]],
    ['empty', '', [[['basePath'], BASE_PATH]]],
    ['an absolute URL', 'https://fleet.example.com/api-fleet/v1', [[['basePath'], BASE_PATH]]],
    ['null', null, [[['basePath'], BASE_PATH]]],
    ['a number', 1, [[['basePath'], BASE_PATH]]],
  ])('basePath %s', async (name, basePath, expected) => {
    expect(await findings(withField('basePath', basePath))).toEqual(expected);
  });

  test('host, schemes and basePath are reported together and independently', async () => {
    const document = clone(okExample);
    delete document.host;
    document.schemes = ['wss'];
    document.basePath = 'v1';
    expect(await findings(document)).toEqual(sorted([
      [[], HOST_MISSING],
      [['schemes', '0'], SCHEME],
      [['basePath'], BASE_PATH],
    ]));
  });

  test('servers is an OpenAPI 3 field: in Swagger 2.0 it neither replaces host nor is evaluated', async () => {
    const document = clone(okExample);
    delete document.host;
    document.servers = [{ url: '/relative' }];
    expect(await findings(document)).toEqual([[[], HOST_MISSING]]);
  });

  test('an unquoted swagger version is still evaluated as Swagger 2.0', async () => {
    const document = withField('host', undefined);
    document.swagger = 2;
    expect(await findings(document)).toEqual([[[], HOST_MISSING]]);
  });

  test('a large API with 400 paths is compliant when the host is defined and reported once when it is not', async () => {
    const responses = { 200: { description: 'Ok' } };
    const paths = {};
    for (let index = 0; index < 400; index += 1) {
      paths[`/depots/d${index}/vehicles`] = { get: { operationId: `listDepot${index}`, schemes: ['ws'], responses }, post: { operationId: `addDepot${index}`, responses } };
    }
    const document = { swagger: '2.0', info: { title: 'Depots API', version: '1.0.0' }, host: 'depots.example.com', basePath: '/api-depots/v1', paths };
    expect(await findings(document)).toEqual([]);
    delete document.host;
    expect(await findings(document)).toEqual([[[], HOST_MISSING]]);
  });
});
