module.exports = {
  swagger: '2.0',
  info: { $ref: '#/x-shared-info' },
  'x-shared-info': { version: '1.0.0', title: 'Test Shared Billing API' },
  paths: {
    '/invoices': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
