module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': {
      get: {
        parameters: [
          { in: 'query', name: 'a', type: 'string', required: true },
          { in: 'query', name: 'b', type: 'string', required: false },
          { in: 'query', name: 'c', type: 'string', required: true },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
