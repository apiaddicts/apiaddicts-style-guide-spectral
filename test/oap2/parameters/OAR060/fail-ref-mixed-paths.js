module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/status': {
      get: {
        parameters: [{ $ref: '#/parameters/SharedByBoth' }],
        responses: { 200: { description: 'Ok' } },
      },
    },
    '/pets': {
      get: {
        parameters: [{ $ref: '#/parameters/SharedByBoth' }],
        responses: { 200: { description: 'Ok' } },
      },
    },
  },
  parameters: {
    SharedByBoth: { in: 'query', name: 'q', type: 'string', required: true },
  },
};
