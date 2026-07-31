module.exports = {
  swagger: '2.5',
  info: {
    version: '1.0.0',
    title: 'OAR085 Swagger 2.0 — fail (unsupported version)',
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
