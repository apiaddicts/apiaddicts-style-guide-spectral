module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': {
      get: {
        parameters: [{ in: 'query', name: 'filter', required: false, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
