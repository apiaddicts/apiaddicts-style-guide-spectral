const { linterForRule } = require('../../helpers/utils');

let linter;

const oar037fail = require('./OAR037/fail-string-format');
const oar037ok = require('./OAR037/ok-string-format');

beforeAll(async () => {
  linter = await linterForRule('apiq:OAR037');
  return linter;
});

test('apiq:OAR037 should find errors', () => {
  return linter.run(oar037fail).then((results) => {
    expect(results.length).toBe(9);
    expect(results[0].path.join('.')).toBe('paths./invoices.get.parameters.0.schema.format');
    expect(results[0].message).toBe('OAR037: Schema with type string has unrecognized format: dateTime');
    expect(results[1].path.join(".")).toBe('paths./invoices.parameters.0.schema.format');
    expect(results[1].message).toBe('OAR037: Schema with type boolean should not specify format');
    expect(results[2].path.join(".")).toBe('paths./invoices.get.responses.200.content.application/json.schema.properties.binary.format');
    expect(results[2].message).toBe('OAR037: Schema with type string has unrecognized format: Binari');
    expect(results[3].path.join(".")).toBe('paths./invoices.post.requestBody.content.application/json.schema.properties.byte.format');
    expect(results[3].message).toBe('OAR037: Schema with type string has unrecognized format: Bite');
    expect(results[4].path.join(".")).toBe('paths./invoices.post.responses.200.content.application/json.schema.properties.byte.format');
    expect(results[4].message).toBe('OAR037: Schema with type string has unrecognized format: Bite');
    expect(results[5].path.join(".")).toBe('paths./invoices.post.responses.200.content.application/json.schema.properties.binary.format');
    expect(results[5].message).toBe('OAR037: Schema with type string has unrecognized format: Binari');
    expect(results[6].path.join(".")).toBe('paths./invoices.post.responses.200.content.application/json.schema.properties.other.items.format');
    expect(results[6].message).toBe('OAR037: Schema with type string has unrecognized format: other');
    expect(results[7].path.join(".")).toBe('paths./invoices/{invoiceId}.get.responses.200.content.application/json.schema.properties.byte.format');
    expect(results[7].message).toBe('OAR037: Schema with type string has unrecognized format: Bite');
    expect(results[8].path.join(".")).toBe('paths./invoices/{invoiceId}.get.responses.200.content.application/json.schema.properties.binary.format');
    expect(results[8].message).toBe('OAR037: Schema with type string has unrecognized format: Binari');
  });
});

test('apiq:OAR037 should find no errors', () => {
  return linter.run(oar037ok).then((results) => {
    expect(results.length).toBe(0);
  });
});