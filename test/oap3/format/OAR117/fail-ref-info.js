module.exports = {
  openapi: '3.0.3',
  info: { $ref: '#/components/x-shared-info' },
  paths: {
    '/payments': { get: { responses: { 200: { description: 'OK' } } } }
  },
  components: {
    'x-shared-info': { version: '1.0.0', title: 'Test Shared Payments API' }
  }
};
