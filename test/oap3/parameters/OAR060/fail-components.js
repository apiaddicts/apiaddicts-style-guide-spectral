module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': { get: { responses: { 200: { description: 'OK' } } } },
  },
  components: {
    parameters: {
      SharedQuery: { in: 'query', name: 'q', required: true, schema: { type: 'string' } },
    },
  },
};
