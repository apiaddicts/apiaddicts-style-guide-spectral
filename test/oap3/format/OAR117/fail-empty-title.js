// Used with pattern ^$ : an empty title is a string, so an expression accepting emptiness matches it.
module.exports = {
  openapi: '3.0.3',
  info: { version: '1.0.0', title: '' },
  paths: {
    '/payments': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
