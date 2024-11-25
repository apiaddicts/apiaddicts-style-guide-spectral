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
    expect(results.length).toBe(5);
    expect(results[0].path.join('.')).toBe('paths./invoices.parameters.0');
    expect(results[0].message).toBe('OAR037: Path and query parameters should specify a maximum length (maxLength).');
    expect(results[1].path.join('.')).toBe('paths./invoices.parameters.1');
    expect(results[1].message).toBe('OAR037: Path and query parameters should specify a maximum length (maxLength) and characters allowed (pattern).');
    expect(results[2].path.join(".")).toBe('paths./invoices.get.parameters.0');
    expect(results[2].message).toBe('OAR037: Path and query parameters should specify characters allowed (pattern).');
    expect(results[3].path.join(".")).toBe('paths./invoices/{invoiceId}.get.parameters.0');
    expect(results[3].message).toBe('OAR037: Path and query parameters should specify characters allowed (pattern).');
    expect(results[4].path.join(".")).toBe('paths./invoices/{invoiceId}.get.parameters.1');
    expect(results[4].message).toBe('OAR037: Path and query parameters maximum length should be less than 2083');
  });
});

test('apiq:OAR037 should find no errors', () => {
  return linter.run(oar037ok).then((results) => {
    expect(results.length).toBe(0);
  });
});