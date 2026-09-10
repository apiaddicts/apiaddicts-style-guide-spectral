module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/status': {
      get: {
        parameters: [{ in: 'query', name: 'verbose', required: true, schema: { type: 'boolean' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
