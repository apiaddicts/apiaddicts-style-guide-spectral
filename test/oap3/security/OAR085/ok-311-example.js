module.exports = {
  openapi: '3.1.1',
  info: {
    version: '1.0.0',
    title: 'OAR085 OpenAPI 3.1.1 — ok (3.1.1 is in the default valid-versions)',
  },
  paths: {
    '/pets': {
      get: {
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};
