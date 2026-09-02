module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/status': {
      get: {
        parameters: [{ $ref: '#/parameters/SharedRefOnly' }],
        responses: { 200: { description: 'Ok' } },
      },
    },
  },
  parameters: {
    SharedRefOnly: { in: 'query', name: 'q', type: 'string', required: true },
  },
};
