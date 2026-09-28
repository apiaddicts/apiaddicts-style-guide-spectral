module.exports = {
  openapi: '3.0.3',
  info: { version: '1.0.0', title: 'Payments API' },
  paths: {
    '/payments': { get: { responses: { 200: { description: 'OK' } } } },
    '/payments/{id}': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
