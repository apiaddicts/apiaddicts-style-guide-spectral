module.exports = {
  openapi: '3.0.4',
  info: {
    version: '1.0.0',
    title: 'OAR085 OpenAPI 3.0.4 — ok (3.0.4 is in the default valid-versions)',
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
