module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR096 — security opt-out',
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
  paths: {
    '/public': {
      get: {
        security: [],
        responses: {
          '200': { description: 'Ok' },
        },
      },
    },
    '/secured': {
      get: {
        responses: {
          '200': { description: 'Ok' },
        },
      },
    },
  },
};
