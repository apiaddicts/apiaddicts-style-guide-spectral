module.exports = {
  openapi: '3.2.0',
  info: {
    version: '1.0.0',
    title: 'OAR085 OpenAPI 3.2 — ok (3.2.0 is in the default valid-versions)',
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
