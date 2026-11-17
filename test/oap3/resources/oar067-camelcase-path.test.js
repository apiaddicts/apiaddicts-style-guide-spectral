const { linterForRule } = require('../../helpers/utils');

const oar067fail = require('./OAR067/fail-example');
const oar067ok = require('./OAR067/ok-example');
const failReportedCase = require('./OAR067/fail-reported-case');
const okReportedCase = require('./OAR067/ok-reported-case');
const failRefs = require('./OAR067/fail-refs');
const okRefs = require('./OAR067/ok-refs');
const failCompositions = require('./OAR067/fail-compositions');
const okCompositions = require('./OAR067/ok-compositions');
const failExample31 = require('./OAR067/fail-example-31');
const okExample31 = require('./OAR067/ok-example-31');
const failExample320 = require('./OAR067/fail-example-320');
const okExample320 = require('./OAR067/ok-example-320');
const failParams = require('./OAR067/fail-params');
const okParams = require('./OAR067/ok-params');

const RULE = 'apiq:OAR067';
const MESSAGE = 'OAR067: RequestBody and Responses schema property names must be compliant with the camelCase naming convention.';
const split = (path) => (Array.isArray(path) ? path : path.split(' '));
const sorted = (paths) => paths.map((path) => split(path).join(' ')).sort();
const clone = (value) => JSON.parse(JSON.stringify(value));
const withVersion = (document, openapi) => ({ ...clone(document), openapi });

let linter;
const linters = new Map();
const withOptions = async (functionOptions) => {
  const key = JSON.stringify(functionOptions);
  if (!linters.has(key)) linters.set(key, await linterForRule(RULE, { functionOptions }));
  return linters.get(key);
};
const run = async (document, functionOptions) => {
  const custom = functionOptions === undefined ? linter : await withOptions(functionOptions);
  return (await custom.run(document)).filter((r) => r.code === RULE);
};
const findings = async (document, functionOptions) => sorted((await run(document, functionOptions)).map((r) => r.path.map(String)));

const REPORTED_CASE = [
  'components schemas cheapestSolution properties zonaORLA',
  'components schemas cheapestSolution properties coberturaORLA',
  'components schemas cheapestSolution properties gvalAQS',
];

beforeAll(async () => {
  linter = await linterForRule(RULE);
  return linter;
});

test('apiq:OAR067 should find errors', () => {
  return linter.run(oar067fail).then((results) => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

test('apiq:OAR067 should find no errors', () => {
  return linter.run(oar067ok).then((results) => {
    expect(results.length).toBe(0);
  });
});

describe('apiq:OAR067 - OpenAPI 3.0', () => {
  test('the shipped rule walks the unresolved document with the camelCase naming convention', async () => {
    const results = await run(oar067fail);
    expect(results.every((r) => r.severity === 1 && r.message === MESSAGE)).toBe(true);
    expect(await findings(oar067fail)).toEqual(sorted([
      'paths /user post requestBody content application/json schema properties first_name',
      'paths /user post requestBody content application/json schema properties last_name',
      'paths /user post responses 200 content application/json schema properties user_id',
      'paths /user post responses 200 content application/json schema properties user_name',
    ]));
  });

  test('the reported case: coberturaORLA is reported on its own name, never on the referenced coberturaOrlaEnum', async () => {
    const paths = await findings(failReportedCase);
    expect(paths).toEqual(sorted(REPORTED_CASE));
    expect(paths.some((path) => path.includes('coberturaOrlaEnum'))).toBe(false);
  });

  test('the reported case with camelCase names, coberturaOrla still a $ref, is compliant', async () => {
    expect(await findings(okReportedCase)).toEqual([]);
  });

  test('follows request body, response, schema, chained, circular and pointer $refs, reporting each property once on its definition', async () => {
    expect(await findings(failRefs)).toEqual(sorted([
      'components schemas Order properties order_id',
      'components schemas Order properties Order_Status_Reason',
      'components schemas Order properties billing_address',
      'components schemas Order properties shipping_address',
      'components schemas Order properties totals allOf 1 properties tax_amount',
      'components schemas Address properties street_line',
      'components schemas Address properties country_code',
      'components schemas OrderLine properties unit_price',
      'components schemas Money properties currency_code',
      'components schemas MetadataValue properties value_type',
      'components schemas OrderPatch properties cancel_reason',
      'components schemas OrderInput properties delivery_notes',
      'components schemas Category properties sub_categories',
      'components schemas OrderV2 properties legacy_ref',
      'components schemas Paging properties total_items',
      'components schemas Problem properties error_code',
      'paths /orders/{orderId}/notes post requestBody content application/json schema properties note_text',
    ]));
  });

  test('two properties that reference the same schema are two findings', async () => {
    const paths = await findings(failRefs);
    expect(paths).toContain('components schemas Order properties billing_address');
    expect(paths).toContain('components schemas Order properties shipping_address');
    expect(paths.some((path) => path.startsWith('components schemas Address ') && !/properties (street_line|country_code)$/.test(path))).toBe(false);
  });

  test('ignores parameter and header schemas, 3.0 siblings of $ref, unused components, external and missing $refs', async () => {
    const paths = (await findings(failRefs)).join('\n');
    ['page_size', 'order_status', 'remaining_calls', 'ignored_sibling', 'search_term', 'unused_field', 'unused_body_field', 'unused_response_field'].forEach((name) => {
      expect(paths).not.toContain(name);
    });
  });

  test('the refs example with camelCase names is compliant', async () => {
    expect(await findings(okRefs)).toEqual([]);
  });

  test('walks nested properties, items, compositions, not, additionalProperties, every method and callbacks', async () => {
    expect(await findings(failCompositions)).toEqual(sorted([
      'components schemas Adjuster properties license_no',
      'components schemas CashSettlement properties iban_number',
      'components schemas Claim allOf 1 properties Adjuster',
      'components schemas ClaimForm properties incident properties location properties geo_hash',
      'components schemas ClosedEvent properties closure_reason',
      'components schemas RepairSettlement properties workshop_id',
      'paths /claims get responses 200 content application/json schema properties _links',
      'paths /claims get responses 200 content application/json schema properties _links properties next_page',
      'paths /claims get responses 200 content application/json schema properties items items properties claim_status',
      'paths /claims get responses 200 content application/json schema properties items items properties policy properties holder properties birth_date',
      'paths /claims get responses 200 content text/csv schema properties csv_row',
      ['paths', '/claims', 'post', 'callbacks', 'claimAssessed', '{$request.body#/claimForm/callbackUrl}', 'post', 'requestBody', 'content', 'application/json', 'schema', 'properties', 'assessment_id'],
      ['paths', '/claims', 'post', 'callbacks', 'claimAssessed', '{$request.body#/claimForm/callbackUrl}', 'post', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'ack_code'],
      'paths /claims post requestBody content multipart/form-data schema properties photo_files',
      'paths /claims/{claimId} delete requestBody content application/json schema properties deletion_note',
      'paths /claims/{claimId} head responses 200 content application/json schema properties head_check',
      'paths /claims/{claimId} options responses 200 content application/json schema properties allowed_methods',
      'paths /claims/{claimId} patch requestBody content application/json schema properties patch_ops',
      'paths /claims/{claimId} put requestBody content application/json schema properties put_reason',
      'paths /claims/{claimId} trace responses 200 content message/http schema properties trace_hops',
      'paths /claims/{claimId}/documents get responses 200 content application/json schema properties @id',
      'paths /claims/{claimId}/documents get responses 200 content application/json schema properties HTMLContent',
      'paths /claims/{claimId}/documents get responses 200 content application/json schema properties byType additionalProperties properties doc_count',
      'paths /claims/{claimId}/documents get responses 200 content application/json schema properties matrix items items properties cell_value',
      'paths /claims/{claimId}/documents get responses 200 content application/json schema properties properties properties page_count',
      'paths /claims/{claimId}/documents get responses 200 content application/json schema properties userID',
      'paths /claims/{claimId}/documents get responses 200 content application/json schema properties x-trace-id',
      'paths /claims/{claimId}/settlements post responses 200 content application/json schema anyOf 1 properties rejection_code',
      'paths /claims/{claimId}/settlements post responses 200 content application/json schema not properties forbidden_flag',
    ]));
  });

  test('ignores examples, defaults, encoding headers, schema extensions, x- paths, x- responses, x- callback keys and empty names', async () => {
    const paths = (await findings(failCompositions)).join('\n');
    ['example_only', 'default_only', 'taken_at', 'extension_only', 'x-display_name', 'draft_field', 'internal_trace', 'retry_count'].forEach((name) => {
      expect(paths).not.toContain(name);
    });
    expect((await run(failCompositions)).some((r) => r.path[r.path.length - 1] === '')).toBe(false);
  });

  test('the compositions example with camelCase names is compliant', async () => {
    expect(await findings(okCompositions)).toEqual([]);
  });

  test('3.0.0 to 3.0.4 behave the same', async () => {
    for (const openapi of ['3.0.0', '3.0.1', '3.0.2', '3.0.4']) {
      expect(await findings(withVersion(failReportedCase, openapi))).toEqual(sorted(REPORTED_CASE));
      expect(await findings(withVersion(okReportedCase, openapi))).toEqual([]);
    }
  });
});

describe('apiq:OAR067 - OpenAPI 3.1', () => {
  test('the reported case in 3.1 with nullable array types', async () => {
    const document = withVersion(failReportedCase, '3.1.0');
    const { schemas } = document.components;
    schemas.cheapestSolution.properties.zonaORLA.type = ['integer', 'null'];
    schemas.coberturaOrlaEnum.type = ['integer', 'null'];
    delete schemas.cheapestSolution.properties.zonaORLA.nullable;
    expect(await findings(document)).toEqual(sorted(REPORTED_CASE));
  });

  test('a property whose $ref has siblings in 3.1 is reported once on its name', async () => {
    const document = withVersion(failReportedCase, '3.1.0');
    document.components.schemas.cheapestSolution.properties.coberturaORLA.description = 'CRM ORLA coverage.';
    expect(await findings(document)).toEqual(sorted(REPORTED_CASE));
  });

  test('webhooks, pathItems, $ref siblings, nullable types, $defs, if/then/else, patternProperties, dependentSchemas, prefixItems and contains', async () => {
    expect(await findings(failExample31)).toEqual(sorted([
      'components pathItems ShipmentItem patch requestBody content application/json schema properties patch_reason',
      'components schemas Carrier properties scac_code',
      'components schemas DelayEvent properties delay_minutes',
      'components schemas Parcel $defs Dimension properties unit_of_measure',
      'components schemas Parcel $defs Unused properties defs_only',
      'components schemas Parcel properties gross_weight',
      'components schemas Shipment properties origin_hub',
      'components schemas Tracking properties tracking_number',
      'paths /parcels put requestBody content application/json schema dependentSchemas insurance properties insured_value',
      'paths /parcels put requestBody content application/json schema else properties hand_carry',
      'paths /parcels put requestBody content application/json schema if properties pallet_kind',
      ['paths', '/parcels', 'put', 'requestBody', 'content', 'application/json', 'schema', 'patternProperties', '^x_custom_.*$', 'properties', 'pattern_value'],
      'paths /parcels put requestBody content application/json schema then properties forklift_required',
      'paths /parcels put requestBody content application/json schema unevaluatedProperties properties extra_field',
      'paths /parcels put responses 200 content application/json schema contains properties hub_code',
      'paths /parcels put responses 200 content application/json schema prefixItems 0 properties first_stop',
      'paths /shipments post requestBody content application/json schema properties sibling_note',
      'paths /shipments post responses 201 content application/json schema properties any_extra',
      'paths /shipments post responses 201 content application/json schema properties carrier_info',
      'paths /shipments post responses 201 content application/json schema properties labels items properties label_url',
      'webhooks shipmentDelivered post requestBody content application/json schema properties delivered_at',
    ]));
  });

  test('false properties, schema examples and unused pathItems are not reported', async () => {
    const paths = (await findings(failExample31)).join('\n');
    ['legacy_code', 'example_key', 'unused_item_field'].forEach((name) => expect(paths).not.toContain(name));
  });

  test('the 3.1 example with camelCase names is compliant', async () => {
    expect(await findings(okExample31)).toEqual([]);
  });

  test('3.1.1 behaves like 3.1.0, and 3.0 ignores webhooks, the keywords next to a $ref and $defs not referenced', async () => {
    expect(await findings(withVersion(failExample31, '3.1.1'))).toEqual(await findings(failExample31));
    const as30 = await findings(withVersion(failExample31, '3.0.3'));
    expect(as30).not.toContain('paths /shipments post requestBody content application/json schema properties sibling_note');
    expect(as30.some((path) => path.startsWith('webhooks') || path.includes('$defs Unused'))).toBe(false);
    expect(as30).toContain('components schemas Parcel $defs Dimension properties unit_of_measure');
  });
});

describe('apiq:OAR067 - OpenAPI 3.2', () => {
  test('the reported case in 3.2', async () => {
    expect(await findings(withVersion(failReportedCase, '3.2.0'))).toEqual(sorted(REPORTED_CASE));
    expect(await findings(withVersion(okReportedCase, '3.2.0'))).toEqual([]);
  });

  test('query, additionalOperations, itemSchema, mediaTypes, $self refs, pathItems, callbacks and webhooks', async () => {
    expect(await findings(failExample320)).toEqual(sorted([
      'components mediaTypes TitlePage schema properties total_count',
      'components pathItems Channels query requestBody content application/json schema properties channel_filter',
      'components schemas Channel properties channel_name',
      'components schemas PlaybackEvent properties position_ms',
      'components schemas PurgeJob properties purge_scope',
      ['paths', '/subscriptions', 'post', 'callbacks', 'onRenewal', '{$request.body#/callbackUrl}', 'additionalOperations', 'NOTIFY', 'requestBody', 'content', 'application/json', 'schema', 'properties', 'notify_channel'],
      ['paths', '/subscriptions', 'post', 'callbacks', 'onRenewal', '{$request.body#/callbackUrl}', 'query', 'requestBody', 'content', 'application/json', 'schema', 'properties', 'renewal_period'],
      'paths /titles additionalOperations COPY requestBody content application/json schema properties target_catalog',
      'paths /titles query requestBody content application/json schema properties search_text',
      'paths /titles query responses 200 content application/jsonl itemSchema properties match_score',
      'webhooks liveEventStarted additionalOperations ANNOUNCE requestBody content application/json schema properties announce_text',
      'webhooks liveEventStarted post requestBody content application/json schema properties started_at',
    ]));
  });

  test('querystring parameters, itemEncoding and prefixEncoding headers and unused mediaTypes are not reported', async () => {
    const paths = (await findings(failExample320)).join('\n');
    ['release_year', 'item_meta', 'part_meta', 'unused_media_field'].forEach((name) => expect(paths).not.toContain(name));
  });

  test('the 3.2 example with camelCase names is compliant', async () => {
    expect(await findings(okExample320)).toEqual([]);
  });

  test('3.1 does not know query, additionalOperations, itemSchema or $self', async () => {
    const paths = await findings(withVersion(failExample320, '3.1.0'));
    ['search_text', 'match_score', 'target_catalog', 'renewal_period', 'notify_channel', 'announce_text', 'purge_scope'].forEach((name) => {
      expect(paths.join('\n')).not.toContain(name);
    });
    expect(paths).toContain('webhooks liveEventStarted post requestBody content application/json schema properties started_at');
  });
});

describe('apiq:OAR067 - naming-convention option', () => {
  const LOCATIONS = [
    'paths /accounts post requestBody content application/json schema',
    'components schemas AccountProfile',
  ];
  const REPORTED_BY = {
    userId: 'SKU', user_id: 'KCU', 'user-id': 'SCU', UserId: 'SKC', USER_ID: 'SKCU', 'USER-ID': 'SKCU', userid: 'U', USERID: 'SKCU',
    fileV2: 'SKU', v2File: 'SKU', user2: 'U', ipV4Address: 'SKU', userID: 'SKCU', HTMLContent: 'SKCU', iPhone: 'SKU', a: 'U', A: 'SKC',
    z9: 'U', _links: 'KCU', '@type': 'SKCU', $schema: 'KCU', 'x-trace-id': 'SCU', 'user.name': 'SKCU', 'user/name': 'SKCU',
    '.hidden': 'SKCU', '-leading': 'SCU', _leading: 'KCU', 'user-Name': 'SKCU', User_Name: 'SKCU', zonaORLA: 'SKCU',
    coberturaORLA: 'SKCU', gvalAQS: 'SKCU', userName1: 'SKU', user1Name: 'SKU', 'name 1': 'SKCU', año2024: 'SKCU', über: 'SKCU',
    customer_id_2: 'KCU', 'customer-id-2': 'SCU', '2fa': 'U', 123: '', Id: 'SKC', aB: 'SKU', aBC: 'SKCU', Ab: 'SKC', ABc: 'SKCU',
    ab1C: 'SKU', user$id: 'KCU', UserID: 'SKCU', Address2: 'SKC', V2File: 'SKC', '': '',
  };
  const at = (document, location) => split(location).reduce((value, key) => value[key], document);
  const expectedFor = (code) => sorted(LOCATIONS.flatMap((location) => Object.keys(at(failParams, location).properties)
    .filter((name) => REPORTED_BY[name].includes(code))
    .map((name) => [...split(location), 'properties', name])));

  const VARIANTS = [
    ['the ruleset default', undefined, 'C'],
    ['camelCase', { 'naming-convention': 'camelCase' }, 'C'],
    ['snake_case', { 'naming-convention': 'snake_case' }, 'S'],
    ['kebab-case', { 'naming-convention': 'kebab-case' }, 'K'],
    ['UpperCamelCase', { 'naming-convention': 'UpperCamelCase' }, 'U'],
    ['padded lowercase "  camelcase "', { 'naming-convention': '  camelcase ' }, 'C'],
    ['SNAKE_CASE', { 'naming-convention': 'SNAKE_CASE' }, 'S'],
    ['Kebab-Case', { 'naming-convention': 'Kebab-Case' }, 'K'],
    ['uppercamelcase', { 'naming-convention': 'uppercamelcase' }, 'U'],
    ['unknown PascalCase falls back to camelCase', { 'naming-convention': 'PascalCase' }, 'C'],
    ['unknown snake-case falls back to camelCase', { 'naming-convention': 'snake-case' }, 'C'],
    ['an empty value falls back to camelCase', { 'naming-convention': '' }, 'C'],
    ['a number falls back to camelCase', { 'naming-convention': 42 }, 'C'],
    ['the former casing type option is ignored', { 'naming-convention': undefined, type: 'pascal' }, 'C'],
  ];

  test('every name of the matrix has its expected conventions', () => {
    LOCATIONS.forEach((location) => {
      expect(Object.keys(at(failParams, location).properties).sort()).toEqual(Object.keys(REPORTED_BY).sort());
    });
  });

  test.each(VARIANTS)('%s reports exactly the names marked for it', async (_label, functionOptions, code) => {
    const expected = expectedFor(code);
    expect(expected.length).toBeGreaterThan(0);
    expect(await findings(failParams, functionOptions)).toEqual(expected);
  });

  test('the default reports the reported names and accepts digits', async () => {
    const paths = await findings(failParams);
    ['zonaORLA', 'coberturaORLA', 'gvalAQS', 'userID', 'user_id', 'UserId', '_links', '@type', 'x-trace-id', 'año2024'].forEach((name) => {
      expect(paths).toContain(`components schemas AccountProfile properties ${name}`);
    });
    ['userId', 'fileV2', 'v2File', 'ipV4Address', 'iPhone', 'a', 'userName1'].forEach((name) => {
      expect(paths).not.toContain(`components schemas AccountProfile properties ${name}`);
    });
  });

  test('a name that starts with digits is camelCase, as in OAR011 and OAR012', async () => {
    const paths = await findings(failParams);
    ['2fa', '123', 'z9', 'user2'].forEach((name) => {
      expect(paths).not.toContain(`components schemas AccountProfile properties ${name}`);
    });
  });

  test('the camelCase names are compliant with the default and any spelling of camelCase', async () => {
    expect(await findings(okParams)).toEqual([]);
    expect(await findings(okParams, { 'naming-convention': 'camelCase' })).toEqual([]);
    expect(await findings(okParams, { 'naming-convention': '  CAMELCASE ' })).toEqual([]);
  });

  test('the camelCase names are not compliant with UpperCamelCase, and snake_case rejects the ones with capitals', async () => {
    expect((await findings(okParams, { 'naming-convention': 'UpperCamelCase' })).length).toBe(24);
    expect(await findings(okParams, { 'naming-convention': 'snake_case' })).toEqual(sorted(['userId', 'fileV2', 'v2File', 'ipV4Address', 'iPhone', 'userName1', 'user1Name', 'oauth2Token', 'addressLine2']
      .flatMap((name) => [`paths /accounts post requestBody content application/json schema properties ${name}`, `components schemas AccountProfile properties ${name}`])));
  });
});
