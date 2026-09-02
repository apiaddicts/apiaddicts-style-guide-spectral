module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': {
      get: {
        parameters: [
          { in: 'query', name: 'a', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'b', required: false, schema: { type: 'string' } },
          { in: 'query', name: 'c', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
