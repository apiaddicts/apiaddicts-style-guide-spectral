module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR085 Swagger 2.0 — ok (supported version)',
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
