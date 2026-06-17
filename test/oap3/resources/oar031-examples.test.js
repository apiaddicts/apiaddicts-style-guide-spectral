const { linterForRule } = require('../../helpers/utils');

const oar031fail = require('./OAR031/fail-example');
const oar031ok = require('./OAR031/ok-example');

const ALL_ON = {
  validateResponse: true,
  validateRequestBody: true,
  validateParameter: true,
  validateProperty: true,
};

// Each test fixes its own functionOptions so it is independent of the shipped
// default configured in apq-spectral.yaml.
const run = async (functionOptions, doc) => {
  const linter = await linterForRule('apiq:OAR031', { functionOptions });
  return linter.run(doc);
};

const isParamMsg = (m) => /^OAR031: Parameter '.*' must have an example defined$/.test(m);
const isPropMsg = (m) => /^OAR031: Property '.*' is missing an example\.$/.test(m);
const RESPONSE_MSG = 'OAR031: Response must have an example defined';
const REQUEST_MSG = 'OAR031: Request body must have an example defined';

describe('apiq:OAR031 (OAS3) — all levels enabled', () => {
  test('flags every level in the fail example', async () => {
    expect((await run(ALL_ON, oar031fail)).length).toBe(12);
  });

  test('no findings in the compliant example', async () => {
    expect((await run(ALL_ON, oar031ok)).length).toBe(0);
  });

  test('emits a distinct message for each of the four levels', async () => {
    const messages = (await run(ALL_ON, oar031fail)).map((r) => r.message);
    expect(messages).toContain(RESPONSE_MSG);
    expect(messages).toContain(REQUEST_MSG);
    expect(messages.some(isParamMsg)).toBe(true);
    expect(messages.some(isPropMsg)).toBe(true);
  });
});

describe('apiq:OAR031 (OAS3) — per-level toggles', () => {
  test('validateResponse:false drops only response-level findings', async () => {
    const results = await run({ ...ALL_ON, validateResponse: false }, oar031fail);
    expect(results.length).toBe(8);
    expect(results.every((r) => r.message !== RESPONSE_MSG)).toBe(true);
  });

  test('validateRequestBody:false drops only request-body-level findings', async () => {
    const results = await run({ ...ALL_ON, validateRequestBody: false }, oar031fail);
    expect(results.length).toBe(11);
    expect(results.every((r) => r.message !== REQUEST_MSG)).toBe(true);
  });

  test('validateParameter:false drops only parameter-level findings', async () => {
    const results = await run({ ...ALL_ON, validateParameter: false }, oar031fail);
    expect(results.length).toBe(10);
    expect(results.every((r) => !isParamMsg(r.message))).toBe(true);
  });

  test('validateProperty:false drops only property-level findings', async () => {
    const results = await run({ ...ALL_ON, validateProperty: false }, oar031fail);
    expect(results.length).toBe(7);
    expect(results.every((r) => !isPropMsg(r.message))).toBe(true);
  });

  test('all levels disabled yields no findings', async () => {
    const results = await run({
      validateResponse: false,
      validateRequestBody: false,
      validateParameter: false,
      validateProperty: false,
    }, oar031fail);
    expect(results.length).toBe(0);
  });
});
