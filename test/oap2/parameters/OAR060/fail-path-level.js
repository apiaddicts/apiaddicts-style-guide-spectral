module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': {
      parameters: [{ in: 'query', name: 'shared', type: 'string', required: true }],
      get: { responses: { 200: { description: 'OK' } } },
    },
  },
};
