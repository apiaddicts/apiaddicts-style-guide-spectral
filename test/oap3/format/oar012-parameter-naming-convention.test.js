const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { linterForRule } = require('../../helpers/utils');

const parameterNamingConvention = require('../../../functions/apq-parameter-naming-convention');

const failReported = require('./OAR012/fail-reported-allof');
const okReported = require('./OAR012/ok-reported-allof');
const failExample = require('./OAR012/fail-example');
const okExample = require('./OAR012/ok-example');
const failRefs = require('./OAR012/fail-refs');
const okRefs = require('./OAR012/ok-refs');
const failExample31 = require('./OAR012/fail-example-31');
const okExample31 = require('./OAR012/ok-example-31');
const failExample320 = require('./OAR012/fail-example-320');
const okExample320 = require('./OAR012/ok-example-320');
const failConventions = require('./OAR012/fail-conventions');
const failCompositions = require('./OAR012/fail-compositions');
const okCompositions = require('./OAR012/ok-compositions');

const RULE = 'apiq:OAR012';
const MESSAGE = 'OAR012: Path params, query params, object names and property names must follow the configured naming convention.';
const K = 'kebab-case';
const S = 'snake_case';
const C = 'camelCase';
const U = 'UpperCamelCase';
const CONVENTIONS = [S, K, C, U];

const TESTS = [
  { namingConvention: C, name: 'camel' },
  { namingConvention: S, name: 'snake' },
  { namingConvention: K, name: 'kebab' },
  { namingConvention: U, name: 'upper-camel' },
];

const at = (path) => path.split(' ');
const sorted = (entries) => [...entries].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
const linterFor = (convention) => linterForRule(RULE, convention === undefined ? {} : { functionOptions: { 'naming-convention': convention } });
const findings = async (linter, document) => {
  const results = (await linter.run(document)).filter((r) => r.code === RULE);
  results.forEach((r) => {
    expect(r.message).toBe(MESSAGE);
    expect(r.severity).toBe(1);
  });
  return sorted(results.map((r) => r.path));
};
const asDocument = (fixture, name) => new Document(JSON.stringify(fixture, null, 2), Parsers.Json, name);

TESTS.forEach(({ namingConvention, name }) => {
  let linter;

  const failParams = require(`./OAR012/fail-${name}-param`);
  const okParams = require(`./OAR012/ok-${name}-param`);

  beforeAll(async () => {
    linter = await linterFor(namingConvention);
    return linter;
  });

  test(`apiq:OAR012 (${namingConvention}) should find errors`, async () => {
    const results = await linter.run(failParams);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test(`apiq:OAR012 (${namingConvention}) should find no errors`, async () => {
    const results = await linter.run(okParams);
    expect(results.length).toBe(0);
  });
});

describe('apiq:OAR012 - reported case', () => {
  let linter;

  beforeAll(async () => {
    linter = await linterFor(undefined);
  });

  test('a property declared in an allOf branch of a shared response is reported on its key', async () => {
    const expected = [at('components responses getStatusResponse content application/json schema allOf 1 properties dataId')];
    expect(await findings(linter, failReported)).toEqual(expected);
    expect(await findings(linter, asDocument(failReported, 'health.json'))).toEqual(expected);
  });

  test('the snake_case mirror of the reported case is compliant', async () => {
    expect(await findings(linter, okReported)).toEqual([]);
  });
});

describe('apiq:OAR012 - OpenAPI 3.0', () => {
  let linter;

  beforeAll(async () => {
    linter = await linterFor(undefined);
  });

  test('checks path and query parameters and property names everywhere, plus components.schemas names', async () => {
    expect(await findings(linter, failExample)).toEqual(sorted([
      at('paths /customers/{customerId} parameters 0 name'),
      at('paths /customers/{customerId} get parameters 0 name'),
      at('paths /customers/{customerId} get parameters 3 content application/json schema properties minBalance'),
      at('paths /customers/{customerId} get responses 200 headers X-Rate-Limit schema properties remainingCalls'),
      at('paths /customers/{customerId} get responses 200 content application/json schema allOf 1 properties fullName'),
      at('paths /customers/{customerId} get responses 200 content application/json schema allOf 1 properties contact_details properties phoneNumber'),
      at('paths /customers/{customerId} get responses 200 content application/xml schema properties xmlName'),
      at('paths /customers/{customerId} put requestBody content application/json schema oneOf 0 properties homeAddress'),
      at('paths /customers/{customerId} put requestBody content application/json schema anyOf 0 properties taxId'),
      at('paths /customers/{customerId} put requestBody content application/json encoding homeAddress headers X-Part schema properties partNumber'),
      at('paths /customers/{customerId} trace parameters 0 name'),
      at('paths /customers post callbacks customer_events {$request.body#/callback_url} post parameters 0 name'),
      at('paths /customers post callbacks customer_events {$request.body#/callback_url} post requestBody content application/json schema properties eventType'),
      at('paths /customers post responses 201 content application/json schema items properties createdId'),
      at('components schemas base_entity properties createdAt'),
      at('components schemas base_entity properties audit_info properties lastModifiedBy'),
      at('components schemas base_entity properties tags items properties tagLabel'),
      at('components schemas base_entity properties metadata additionalProperties properties extraValue'),
      at('components schemas CustomerProfile'),
      at('components schemas unused_model properties unusedField'),
      at('components parameters pageSize name'),
      at('components parameters unused_filter name'),
      at('components requestBodies customer_body content application/json schema properties nickName'),
      at('components responses problem content application/problem+json schema properties errorCode'),
      at('components headers trace_header schema properties spanId'),
      at('components callbacks status_changed {$request.body#/status_url} post requestBody content application/json schema properties newStatus'),
    ]));
  });

  test('ignores header and cookie parameters, not, examples, extensions and the $filter exception', async () => {
    expect(await findings(linter, okExample)).toEqual([]);
  });

  test('follows chained refs, circular schemas, pointers into properties and $ref path items, once on each definition', async () => {
    const expected = sorted([
      at('x-path-items product_item get parameters 0 name'),
      at('components schemas product_page properties pageInfo'),
      at('components schemas product allOf 1 properties productName'),
      at('components schemas product allOf 1 properties unitPrice'),
      at('components schemas product allOf 1 properties unitPrice properties currencyCode'),
      at('components schemas base_model properties createdBy'),
      at('components schemas category properties categoryName'),
      at('components headers location_header schema properties resourceUri'),
    ]);
    expect(await findings(linter, failRefs)).toEqual(expected);
    expect(await findings(linter, asDocument(failRefs, 'catalog.json'))).toEqual(expected);
  });

  test('ignores keywords next to $ref in 3.0 and dangling refs', async () => {
    expect(await findings(linter, okRefs)).toEqual([]);
  });
});

describe('apiq:OAR012 - OpenAPI 3.1', () => {
  let linter;

  beforeAll(async () => {
    linter = await linterFor(undefined);
  });

  test('checks nullable types, every member subschema, keywords next to $ref, $defs, webhooks and components.pathItems', async () => {
    const media = 'paths /shipments get responses 200 content application/json schema properties';
    const expected = sorted([
      at('paths /shipments get parameters 0 name'),
      at(`${media} shipmentId`),
      at(`${media} legs items properties legNumber`),
      at(`${media} route prefixItems 0 properties originPort`),
      at(`${media} attributes patternProperties ^attr[A-Z] properties attrValue`),
      at(`${media} dims dependentSchemas weight_unit properties weightUnit`),
      at(`${media} opt unevaluatedProperties properties extraNote`),
      at(`${media} rule then properties thenField`),
      at(`${media} rule else properties elseField`),
      at(`${media} list contains properties containsField`),
      at(`${media} with_ref properties siblingField`),
      at('webhooks shipment_delivered post parameters 0 name'),
      at('webhooks shipment_delivered post requestBody content application/json schema properties deliveredAt'),
      at('components schemas carrier properties carrierName'),
      at('components schemas carrier $defs contact properties contactEmail'),
      at('components schemas nullableAddress'),
      at('components pathItems delay_events parameters 0 name'),
      at('components pathItems delay_events post requestBody content application/json schema properties delayMinutes'),
    ]);
    expect(await findings(linter, failExample31)).toEqual(expected);
    expect(await findings(linter, asDocument(failExample31, 'logistics.json'))).toEqual(expected);
  });

  test('ignores false schemas, if conditions, propertyNames and pattern keys', async () => {
    expect(await findings(linter, okExample31)).toEqual([]);
  });
});

describe('apiq:OAR012 - OpenAPI 3.2', () => {
  let linter;

  beforeAll(async () => {
    linter = await linterFor(undefined);
  });

  test('checks query, additionalOperations, itemSchema, querystring schemas, encodings and components.mediaTypes', async () => {
    expect(await findings(linter, failExample320)).toEqual(sorted([
      at('paths /quotes query parameters 0 name'),
      at('paths /quotes query requestBody content application/json schema properties symbolList'),
      at('paths /quotes query responses 200 content application/json schema properties lastPrice'),
      at('paths /quotes get parameters 0 content application/x-www-form-urlencoded schema properties sortOrder'),
      at('paths /quotes get responses 200 content text/event-stream itemSchema properties eventData'),
      at('paths /quotes additionalOperations PURGE parameters 0 name'),
      at('webhooks price_alert additionalOperations NOTIFY requestBody content application/json schema properties alertLevel'),
      at('components mediaTypes quote_list schema items properties bidPrice'),
      at('components mediaTypes multipart_upload encoding file_name headers X-Checksum schema properties checksumAlgo'),
      at('components mediaTypes multipart_upload prefixEncoding 0 headers X-Part schema properties partIndex'),
      at('components mediaTypes multipart_upload itemEncoding headers X-Item schema properties itemTag'),
    ]));
  });

  test('ignores the name of a querystring parameter', async () => {
    expect(await findings(linter, okExample320)).toEqual([]);
  });
});

describe('apiq:OAR012 - allOf, oneOf and anyOf', () => {
  let linter;
  const media = 'paths /quotes get responses 200 content application/json schema';
  const COMPOSED = [
    at(`${media} allOf 1 properties quoteRef`),
    at(`${media} allOf 1 properties options items oneOf 2 properties roadCarrier`),
    at(`${media} allOf 2 anyOf 0 properties insuranceFee`),
    at(`${media} allOf 2 anyOf 1 properties handling oneOf 0 properties handlingCode`),
    at('components schemas quote_base properties validUntil'),
    at('components schemas air_option properties airportCode'),
    at('components schemas sea_option oneOf 0 properties vesselName'),
  ];
  const NEXT_TO_REF = at('paths /quotes post requestBody content application/json schema oneOf 0 properties flightNumber');

  beforeAll(async () => {
    linter = await linterFor(undefined);
  });

  test.each(['3.1.0', '3.2.0'])('%s checks nested compositions, $ref branches once each and members next to a $ref branch', async (openapi) => {
    const expected = sorted([...COMPOSED, NEXT_TO_REF]);
    expect(await findings(linter, { ...failCompositions, openapi })).toEqual(expected);
    expect(await findings(linter, asDocument({ ...failCompositions, openapi }, 'freight.json'))).toEqual(expected);
  });

  test('3.0 checks the same compositions but ignores members next to a $ref branch', async () => {
    expect(await findings(linter, { ...failCompositions, openapi: '3.0.3' })).toEqual(sorted(COMPOSED));
  });

  test.each(['3.0.3', '3.1.0', '3.2.0'])('%s snake_case mirror is compliant', async (openapi) => {
    expect(await findings(linter, { ...okCompositions, openapi })).toEqual([]);
  });
});

describe('apiq:OAR012 - naming-convention values', () => {
  const PARAMS = [
    ['order_id', [K, C, U]],
    ['order-id', [S, C, U]],
    ['orderId', [S, K, U]],
    ['OrderId', [S, K, C]],
    ['', [S, K, C, U]],
    ['$filter', []],
    ['$orderby', []],
  ];
  const PROPERTIES = [
    ['address_line2', [K, C, U]],
    ['address-line2', [S, C, U]],
    ['addressLine2', [S, K, U]],
    ['AddressLine2', [S, K, C]],
    ['oauth2Token', [S, K, U]],
    ['customerID', [S, K, C, U]],
    ['HTTPStatus', [S, K, C, U]],
    ['id', [U]],
    ['ID', [S, K, C, U]],
    ['v2', [U]],
    ['user/name', [S, K, C, U]],
    ['{tenant}', [S, K, C, U]],
    ['_internal', [K, C, U]],
    ['user name', [S, K, C, U]],
    ['$custom', [K, C, U]],
    ['A', [S, K, C]],
    ['iban', [U]],
    ['Iban', [S, K, C]],
  ];
  const expectedFor = (convention) => sorted([
    ...PARAMS.flatMap(([, reportedBy], index) => (reportedBy.includes(convention) ? [at(`paths /accounts get parameters ${index} name`)] : [])),
    ...PROPERTIES.flatMap(([name, reportedBy]) => (reportedBy.includes(convention) ? [['components', 'schemas', 'account_matrix', 'properties', name]] : [])),
    ...([K, C, U].includes(convention) ? [at('components schemas account_matrix')] : []),
  ]);

  test.each(CONVENTIONS)('%s reports exactly the names that do not follow it', async (convention) => {
    const linter = await linterFor(convention);
    expect(await findings(linter, failConventions)).toEqual(expectedFor(convention));
  });

  test.each([
    ['  camelcase ', C],
    ['UPPERCAMELCASE', U],
    ['Kebab-Case', K],
    ['SNAKE_CASE', S],
    ['PascalCase', S],
    ['snake-case', S],
    ['', S],
  ])('"%s" is applied as %s', async (value, convention) => {
    const linter = await linterFor(value);
    expect(await findings(linter, failConventions)).toEqual(expectedFor(convention));
  });

  test('the ruleset default is snake_case', async () => {
    const linter = await linterFor(undefined);
    expect(await findings(linter, failConventions)).toEqual(expectedFor(S));
  });
});

describe('apq-parameter-naming-convention - options and unusable input', () => {
  const context = { rule: { name: RULE } };
  const root = {
    openapi: '3.0.3',
    paths: { '/a': { get: { parameters: [{ name: 'pageSize', in: 'query' }, { name: 'page-number', in: 'query' }], responses: {} } } },
  };
  const names = (options) => parameterNamingConvention(root, options, context).map((result) => root.paths['/a'].get.parameters[result.path[4]].name);

  test('reads naming-convention first and namingConvention only when it is null or absent', () => {
    expect(names({ namingConvention: K })).toEqual(['pageSize']);
    expect(names({ 'naming-convention': C, namingConvention: K })).toEqual(['page-number']);
    expect(names({ 'naming-convention': 'PascalCase', namingConvention: K })).toEqual(['pageSize', 'page-number']);
    expect(names({ 'naming-convention': undefined, namingConvention: K })).toEqual(['pageSize']);
    expect(names({ 'naming-convention': null, namingConvention: C })).toEqual(['page-number']);
  });

  test.each([
    ['no options', undefined],
    ['null options', null],
    ['a number', { 'naming-convention': 42 }],
    ['null', { 'naming-convention': null }],
    ['an array', { 'naming-convention': [C] }],
  ])('falls back to snake_case with %s', (_label, options) => {
    expect(names(options)).toEqual(['pageSize', 'page-number']);
  });

  test.each([
    ['a null document', null],
    ['an array', []],
    ['a document without version', { paths: { '/a': { get: { parameters: [{ name: 'pageSize', in: 'query' }] } } } }],
  ])('returns nothing for %s', (_label, document) => {
    expect(parameterNamingConvention(document, {}, context)).toEqual([]);
  });

  test('treats a non-string version as OpenAPI 3.x and skips non-string names', () => {
    const document = { openapi: 3.1, paths: { '/a': { parameters: [{ name: 'pageSize', in: 'query' }, { name: 12, in: 'query' }, { in: 'path' }] } } };
    expect(parameterNamingConvention(document, {}, context)).toHaveLength(1);
  });

  test('skips null and malformed nodes everywhere', () => {
    const document = {
      openapi: '3.2.0',
      paths: {
        '/a': {
          parameters: null,
          get: {
            parameters: [null, [], { name: 'ok_name', in: 'query', schema: null, content: [] }],
            requestBody: { content: { 'application/json': null, 'text/plain': { schema: { properties: null, allOf: null, items: [null], prefixItems: {}, patternProperties: [], dependentSchemas: null, then: 1, $defs: [] } } } },
            responses: { 200: null, 201: { headers: null, content: { 'application/json': { encoding: [], prefixEncoding: {}, itemEncoding: null } } } },
            callbacks: { cb: null, other: { '{$url}': null } },
          },
          additionalOperations: { PURGE: null, LINK: [] },
        },
        '/b': { additionalOperations: [] },
        '/c': null,
      },
      webhooks: null,
      components: { schemas: null, parameters: [], requestBodies: { a: null }, responses: { b: [] }, headers: { c: 1 }, callbacks: { d: null }, pathItems: null, mediaTypes: { e: null } },
    };
    expect(parameterNamingConvention(document, {}, context)).toEqual([]);
  });
});
