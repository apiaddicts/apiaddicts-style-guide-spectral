module.exports = {
  openapi: '3.5.0',
  info: {
    version: '1.0.0',
    title: 'OAR085 OpenAPI 3.0 — fail (unsupported version)',
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
