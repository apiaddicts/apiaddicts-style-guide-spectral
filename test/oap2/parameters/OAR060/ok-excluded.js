module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/status': {
      get: {
        parameters: [{ in: 'query', name: 'verbose', type: 'boolean', required: true }],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
