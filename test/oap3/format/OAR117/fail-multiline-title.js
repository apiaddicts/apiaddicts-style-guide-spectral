module.exports = {
  openapi: '3.0.3',
  info: { version: '1.0.0', title: 'Legacy Billing API\nTest build' },
  paths: {
    '/invoices': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
