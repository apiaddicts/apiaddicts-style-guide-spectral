module.exports = {
  openapi: '3.1.0',
  info: { $ref: '#/components/x-shared-info' },
  paths: {
    '/payments': { get: { responses: { 200: { description: 'OK' } } } }
  },
  components: {
    'x-shared-info': { $ref: '#/components/x-base-info' },
    'x-base-info': { version: '1.0.0', title: 'Test Chained Payments API' }
  }
};
