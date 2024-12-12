const { linterForRule } = require('../../helpers/utils');

let linter;

const oar076fail = require('./OAR076/fail-number-format');
const oar076ok = require('./OAR076/ok-number-format');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR076');
  return linter;
});

test('apiq:OAR076 should find errors', () => {
  return linter.run(oar076fail).then((results) => {
    expect(results.length).toBe(5);
    expect(results[0].path.join('.')).toBe('paths./invoices.parameters.0.schema.format');
    expect(results[0].message).toBe('OAR076: Schema with type number has unrecognized format: ^d{3}-d{2}-d{4}$');
    expect(results[1].path.join(".")).toBe('paths./invoices.parameters.1.schema.format');
    expect(results[1].message).toBe('OAR076: Schema with type boolean should not specify format');
    expect(results[2].path.join(".")).toBe('paths./invoices.get.responses.200.content.application/json.schema.properties.date-time.format');
    expect(results[2].message).toBe('OAR076: Schema with type number has unrecognized format: date-time');
    expect(results[3].path.join(".")).toBe('paths./invoices.get.responses.200.content.application/json.schema.properties.password.format');
    expect(results[3].message).toBe('OAR076: Schema with type boolean should not specify format');
    expect(results[4].path.join(".")).toBe('paths./invoices.get.responses.200.content.application/json.schema.properties.byte.format');
    expect(results[4].message).toBe('OAR076: Schema with type integer has unrecognized format: email');
  });
});

test('apiq:OAR076 should find no errors', () => {
  return linter.run(oar076ok).then((results) => {
    expect(results.length).toBe(0);
  });
});