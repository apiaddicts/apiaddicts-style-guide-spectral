module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'Test Legacy Billing API' },
  paths: {
    '/invoices': { get: { responses: { 200: { description: 'OK' } } } },
    '/invoices/{id}': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
