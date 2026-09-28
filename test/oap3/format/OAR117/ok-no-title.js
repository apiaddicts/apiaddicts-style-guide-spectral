module.exports = {
  openapi: '3.0.3',
  info: { version: '1.0.0', description: 'Test payments sandbox, untitled draft' },
  paths: {
    '/payments': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
