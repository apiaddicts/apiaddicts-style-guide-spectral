module.exports = {
  openapi: '3.0.3',
  info: { version: '1.0.0', title: `${'Enterprise Payments Platform '.repeat(400)}Test` },
  paths: {
    '/payments': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
