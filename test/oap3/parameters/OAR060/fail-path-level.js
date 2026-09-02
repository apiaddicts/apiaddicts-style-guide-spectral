module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': {
      parameters: [{ in: 'query', name: 'shared', required: true, schema: { type: 'string' } }],
      get: { responses: { 200: { description: 'OK' } } },
    },
  },
};
