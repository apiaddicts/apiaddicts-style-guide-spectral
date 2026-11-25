const { linterForRule } = require('../../helpers/utils');

const failExample = require('./OAR122/fail-example');
const okExample = require('./OAR122/ok-example');
const failExample31 = require('./OAR122/fail-example-31');
const okExample31 = require('./OAR122/ok-example-31');
const failExample320 = require('./OAR122/fail-example-320');
const okExample320 = require('./OAR122/ok-example-320');
const failRefs = require('./OAR122/fail-refs');
const okRefs = require('./OAR122/ok-refs');

const RULE = 'apiq:OAR122';
const MISSING = 'OAR122: At least one server must be defined in servers.';
const URL_MESSAGE = 'OAR122: Server URL must be an absolute http or https URL.';
const variableMessage = (name) => `OAR122: Server variable '${name}' must have a string default value.`;

const url = (...path) => [path.map(String), URL_MESSAGE];
const variable = (name, ...path) => [path.map(String), variableMessage(name)];

const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const clone = (value) => JSON.parse(JSON.stringify(value));

let linter;
const findings = async (document) => sorted((await linter.run(document)).filter((r) => r.code === RULE).map((r) => [r.path, r.message]));

const ticketExample = (openapi) => ({
  openapi,
  info: { title: 'Greetings API', version: '1.0.0' },
  servers: [{ url: 'http://greetings-service:8080/api-greetings/v1', description: 'Upstream backend service' }],
  paths: { '/greetings': { get: { responses: { 200: { description: 'Ok' } } } } },
});

const FAIL_EXAMPLE = [
  url('servers', 1, 'url'),
  url('servers', 2, 'url'),
  url('servers', 3, 'url'),
  url('servers', 4, 'url'),
  url('servers', 5, 'url'),
  url('servers', 6, 'url'),
  variable('tenant', 'servers', 6, 'variables', 'tenant'),
  url('servers', 7, 'url'),
  variable('port', 'servers', 7, 'variables', 'port', 'default'),
  url('servers', 8, 'url'),
  variable('basePath', 'servers', 9, 'variables', 'basePath'),
  url('servers', 10),
  url('servers', 11, 'url'),
  url('servers', 12, 'url'),
  url('servers', 13, 'url'),
  url('servers', 14, 'url'),
  url('servers', 15, 'url'),
  url('servers', 16, 'url'),
  url('servers', 17),
  url('servers', 18),
  url('servers', 19, 'url'),
  variable('env', 'servers', 19, 'variables', 'env'),
  url('paths', '/shipments', 'servers', 0, 'url'),
  url('paths', '/shipments', 'post', 'servers', 0, 'url'),
  url('paths', '/shipments/{shipmentId}', 'patch', 'servers', 0, 'url'),
  variable('zone', 'paths', '/shipments/{shipmentId}', 'patch', 'servers', 0, 'variables', 'zone'),
  url('paths', '/shipments/{shipmentId}', 'head', 'servers', 0, 'url'),
  url('paths', '/shipments/{shipmentId}', 'trace', 'servers', 0, 'url'),
];

const FAIL_EXAMPLE_31 = [
  url('servers', 0, 'url'),
  url('paths', '/patients', 'get', 'servers', 0, 'url'),
  variable('site', 'paths', '/patients', 'get', 'servers', 0, 'variables', 'site', 'default'),
  url('paths', '/patients/{patientId}/records', 'servers', 0, 'url'),
  url('paths', '/lab-results', 'get', 'servers', 0, 'url'),
];

const FAIL_EXAMPLE_320 = [
  url('servers', 0, 'url'),
  url('paths', '/appointments', 'query', 'servers', 0, 'url'),
  url('paths', '/appointments', 'additionalOperations', 'COPY', 'servers', 0, 'url'),
  url('paths', '/appointments', 'additionalOperations', 'LINK', 'servers', 0, 'url'),
  variable('clinic', 'paths', '/appointments', 'additionalOperations', 'LINK', 'servers', 0, 'variables', 'clinic'),
];

const FAIL_REFS = [
  url('servers', 0, 'url'),
  url('servers', 1, 'url'),
  url('paths', '/reports', 'servers', 0, 'url'),
  url('paths', '/payments', 'get', 'servers', 0, 'url'),
  url('paths', '/refunds', 'get', 'servers'),
  url('paths', '/tenants', 'get', 'servers', 0, 'url'),
  variable('tenant', 'paths', '/tenants', 'get', 'servers', 0, 'variables', 'tenant'),
  url('paths', '/accounts/{accountId}', 'get', 'servers', 0, 'url'),
];

const relativeServers = (document) => {
  const copy = clone(document);
  copy.servers = [{ url: '/relative' }];
  return copy;
};

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

describe('apiq:OAR122 - OpenAPI 3.0', () => {
  test.each(['3.0.0', '3.0.3', '3.0.4'])('the ticket example %s: an http upstream server is compliant', async (openapi) => {
    expect(await findings(ticketExample(openapi))).toEqual([]);
  });

  test('flags every root, path and operation server without an absolute http or https URL, and every variable without a string default, as an error', async () => {
    const results = (await linter.run(failExample)).filter((r) => r.code === RULE);
    expect(results.every((r) => r.severity === 0)).toBe(true);
    expect(await findings(failExample)).toEqual(sorted(FAIL_EXAMPLE));
  });

  test('accepts http and https servers with hosts, ports, IP addresses, paths, queries and variables with defaults', async () => {
    expect(await findings(okExample)).toEqual([]);
  });

  test('callbacks, the query key, x- paths and servers that are not a list are not evaluated in 3.0', async () => {
    const reported = (await findings(failExample)).map(([path]) => path.join('/'));
    expect(reported.some((path) => path.includes('callbacks') || path.includes('/query/') || path.includes('x-internal') || path.includes('/carriers'))).toBe(false);
  });

  test('a document without servers is reported once, on the document', async () => {
    const document = clone(okExample);
    delete document.servers;
    expect(await findings(document)).toEqual([[[], MISSING]]);
  });

  test.each([
    ['an empty list', []],
    ['null', null],
    ['a single server object instead of a list', { url: 'https://api.logistics.example.com' }],
    ['a string', 'https://api.logistics.example.com'],
  ])('root servers as %s is reported on servers', async (name, servers) => {
    const document = clone(okExample);
    document.servers = servers;
    expect(await findings(document)).toEqual([[['servers'], MISSING]]);
  });

  test('path and operation servers do not replace the root servers, and are still checked without them', async () => {
    const document = clone(failExample);
    delete document.servers;
    expect(await findings(document)).toEqual(sorted([
      [[], MISSING],
      ...FAIL_EXAMPLE.filter(([path]) => path[0] === 'paths'),
    ]));
  });

  test('a relative root server is reported even when every operation has absolute servers', async () => {
    expect(await findings(relativeServers(okExample))).toEqual([url('servers', 0, 'url')]);
  });

  test.each([
    ['http://api.example.com', true],
    ['https://api.example.com/v1', true],
    ['http://greetings-service:8080/api-greetings/v1', true],
    ['https://api.example.com:443', true],
    ['https://127.0.0.1', true],
    ['https://[::1]:8443/v1', true],
    ['https://api.example.com/v1#section', true],
    ['https://user@api.example.com', true],
    ['/v1', false],
    ['/', false],
    ['', false],
    ['v1', false],
    ['api.example.com', false],
    ['//api.example.com', false],
    ['Https://api.example.com', false],
    ['https:/api.example.com', false],
    ['https:api.example.com', false],
    ['https://', false],
    ['https:// api.example.com', false],
    ['https://api.example.com:port', false],
    ['https://api.example.com:65536', false],
    ['mailto:api@example.com', false],
    ['ws://api.example.com', false],
    ['grpc://api.example.com', false],
  ])('root server url %j compliant: %s', async (serverUrl, compliant) => {
    const document = ticketExample('3.0.3');
    document.servers = [{ url: serverUrl }];
    expect(await findings(document)).toEqual(compliant ? [] : [url('servers', 0, 'url')]);
  });

  test.each([
    ['every variable used and declared with a string default', 'https://{env}.example.com:{port}/{base}', { env: { default: 'api' }, port: { default: '8443' }, base: { default: 'v1' } }, []],
    ['an empty string default', 'https://api.example.com/{prefix}v1', { prefix: { default: '' } }, []],
    ['a default that breaks the host', 'https://{env}.example.com', { env: { default: 'bad host' } }, [url('servers', 0, 'url')]],
    ['a default with a scheme', '{base}', { base: { default: 'https://api.example.com' } }, [url('servers', 0, 'url')]],
    ['a numeric default', 'https://api.example.com:{port}', { port: { default: 8443 } }, [url('servers', 0, 'url'), variable('port', 'servers', 0, 'variables', 'port', 'default')]],
    ['a boolean default', 'https://{env}.example.com', { env: { default: true } }, [url('servers', 0, 'url'), variable('env', 'servers', 0, 'variables', 'env', 'default')]],
    ['no default', 'https://{env}.example.com', { env: { enum: ['api'] } }, [url('servers', 0, 'url'), variable('env', 'servers', 0, 'variables', 'env')]],
    ['a variable that is not an object', 'https://{env}.example.com', { env: 'api' }, [url('servers', 0, 'url'), variable('env', 'servers', 0, 'variables', 'env')]],
    ['an undeclared variable', 'https://{env}.example.com', undefined, [url('servers', 0, 'url')]],
    ['variables that are not an object', 'https://{env}.example.com', ['env'], [url('servers', 0, 'url')]],
    ['an unused variable without default', 'https://api.example.com', { env: {} }, [variable('env', 'servers', 0, 'variables', 'env')]],
    ['an unclosed brace', 'https://{env.example.com', { env: { default: 'api' } }, [url('servers', 0, 'url')]],
  ])('server variables: %s', async (name, serverUrl, variables, expected) => {
    const document = ticketExample('3.0.3');
    document.servers = [{ url: serverUrl, ...(variables === undefined ? {} : { variables }) }];
    expect(await findings(document)).toEqual(sorted(expected));
  });

  test('documents that are not OpenAPI or Swagger are not evaluated', async () => {
    expect(await findings({ asyncapi: '2.6.0', info: { title: 'Events', version: '1.0.0' }, channels: {} })).toEqual([]);
    expect(await findings({ info: { title: 'Unknown', version: '1.0.0' }, paths: {} })).toEqual([]);
  });

  test('a large API with 300 paths reports exactly its relative operation servers', async () => {
    const responses = { 200: { description: 'Ok' } };
    const paths = {};
    const expected = [];
    for (let index = 0; index < 300; index += 1) {
      const path = `/regions/{regionId}/warehouses/w${index}/items`;
      paths[path] = {};
      ['get', 'post', 'put', 'delete'].forEach((verb, offset) => {
        const relative = (index * 4 + offset) % 9 === 0;
        paths[path][verb] = {
          operationId: `${verb}Items${index}`,
          servers: [{ url: relative ? `/warehouses/w${index}` : `https://w${index}.inventory.example.com/api-inventory/v1` }],
          responses,
        };
        if (relative) expected.push(url('paths', path, verb, 'servers', 0, 'url'));
      });
    }
    const document = { openapi: '3.0.3', info: { title: 'Inventory API', version: '1.0.0' }, servers: [{ url: 'https://inventory.example.com/api-inventory/v1' }], paths };
    expect(expected.length).toBe(134);
    expect(await findings(document)).toEqual(sorted(expected));
  });
});

describe('apiq:OAR122 - $ref resolution', () => {
  test('follows local, chained, whole-list and percent-encoded refs, reports a server shared through refs once, and reports dangling refs', async () => {
    expect(await findings(failRefs)).toEqual(sorted(FAIL_REFS));
  });

  test('servers, path items and variables reached through refs are compliant when they resolve to absolute URLs', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('a relative server referenced only from a path is reported on that path', async () => {
    const document = clone(failRefs);
    document.servers = [{ $ref: '#/x-servers/production' }];
    expect(await findings(document)).toEqual(sorted([
      url('paths', '/invoices', 'servers', 0, 'url'),
      ...FAIL_REFS.filter(([path]) => path[0] === 'paths'),
    ]));
  });
});

describe('apiq:OAR122 - OpenAPI 3.1', () => {
  test.each(['3.1.0', '3.1.1', '3.1.2'])('the ticket example %s is compliant', async (openapi) => {
    expect(await findings(ticketExample(openapi))).toEqual([]);
  });

  test('flags relative root servers, null defaults and path items reached from components.pathItems; webhooks, query and unused path items are not evaluated', async () => {
    expect(await findings(failExample31)).toEqual(sorted(FAIL_EXAMPLE_31));
  });

  test('accepts absolute servers with nullable array types elsewhere in the document', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });
});

describe('apiq:OAR122 - OpenAPI 3.2', () => {
  test.each(['3.2.0', '3.2.1'])('the ticket example %s is compliant', async (openapi) => {
    expect(await findings(ticketExample(openapi))).toEqual([]);
  });

  test('flags URLs relative to $self, and query and additionalOperations servers; callbacks and webhooks are not evaluated', async () => {
    expect(await findings(failExample320)).toEqual(sorted(FAIL_EXAMPLE_320));
  });

  test('accepts named absolute servers on the root, query and additionalOperations', async () => {
    expect(await findings(okExample320)).toEqual([]);
  });

  test('query and additionalOperations are only evaluated from 3.2', async () => {
    const document = clone(failExample320);
    document.openapi = '3.1.1';
    expect(await findings(document)).toEqual([url('servers', 0, 'url')]);
  });

  test('a relative root server is reported in 3.2 even with $self', async () => {
    expect(await findings(relativeServers(okExample320))).toEqual([url('servers', 0, 'url')]);
  });
});
