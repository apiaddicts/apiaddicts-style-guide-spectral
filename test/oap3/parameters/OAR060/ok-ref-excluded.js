module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/status': {
      parameters: [{ $ref: '#/components/parameters/SharedPathLevel' }],
      get: {
        parameters: [{ $ref: '#/components/parameters/SharedRefOnly' }],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
  components: {
    parameters: {
      SharedRefOnly: { in: 'query', name: 'q', required: true, schema: { type: 'string' } },
      SharedPathLevel: { in: 'query', name: 'p', required: true, schema: { type: 'string' } },
    },
  },
};
