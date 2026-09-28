module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', description: 'Test billing sandbox, untitled draft' },
  paths: {
    '/invoices': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
