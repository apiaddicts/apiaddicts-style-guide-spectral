module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/status': {
      get: {
        parameters: [{ $ref: '#/components/parameters/SharedByBoth' }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/pets': {
      get: {
        parameters: [
          { $ref: '#/components/parameters/SharedByBoth' },
          { $ref: '#/components/parameters/ChainedAlias' },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
  components: {
    parameters: {
      SharedByBoth: { in: 'query', name: 'q', required: true, schema: { type: 'string' } },
      ChainedAlias: { $ref: '#/components/parameters/ChainTarget' },
      ChainTarget: { in: 'query', name: 'c', required: true, schema: { type: 'string' } },
    },
  },
};
