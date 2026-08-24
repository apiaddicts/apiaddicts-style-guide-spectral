const op = { get: { responses: { 200: { description: 'OK' } } } };

module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR116' },
  paths: {
    '/pets': op,
    '/pets/{id}': op,
    '/pets/{id}/owners': op,
  },
};
