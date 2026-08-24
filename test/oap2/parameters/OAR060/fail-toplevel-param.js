module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': { get: { responses: { 200: { description: 'OK' } } } },
  },
  parameters: {
    SharedQuery: { in: 'query', name: 'q', type: 'string', required: true },
  },
};
