module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR035 Swagger 2.0 — security opt-out',
  },
  securityDefinitions: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
    },
  },
  security: [{ ApiKeyAuth: [] }],
  paths: {
    '/public': {
      get: {
        security: [],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/secured': {
      get: {
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};
