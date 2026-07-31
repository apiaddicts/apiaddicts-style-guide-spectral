module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR096 Swagger 2.0 — ok',
  },
  securityDefinitions: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
    },
  },
  paths: {
    '/secured': {
      get: {
        security: [{ ApiKeyAuth: [] }],
        responses: {
          '200': { description: 'OK' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/open': {
      get: {
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};
