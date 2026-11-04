const ok = { 200: { description: 'Ok' } };
const implicitFlow = { authorizationUrl: 'https://auth.home.example.com/authorize', scopes: {} };
const passwordFlow = { tokenUrl: 'https://auth.home.example.com/token', scopes: {} };
const codeFlow = {
  authorizationUrl: 'https://auth.home.example.com/authorize',
  tokenUrl: 'https://auth.home.example.com/token',
  scopes: {},
};
const oauth = (flows) => ({ type: 'oauth2', flows });

module.exports = {
  openapi: '3.2.0',
  info: { title: 'Smart Home Devices API', version: '1.5.1' },
  servers: [{ url: 'https://api.home.example.com/v1' }],
  paths: {
    '/health': {
      get: { operationId: 'health', security: [{ '#/components/securitySchemes/HealthOAuth': [] }], responses: ok },
    },
    '/status': {
      additionalOperations: {
        PURGE: { operationId: 'purgeStatusCache', security: [{ StatusOAuth: [] }], responses: ok },
      },
    },
    '/me': { query: { operationId: 'searchMyDevices', security: [{ MeOAuth: [] }], responses: ok } },
    '/devices': {
      query: {
        operationId: 'searchDevices',
        security: [{ '#/components/securitySchemes/DevicesOAuth': [] }],
        responses: ok,
      },
      additionalOperations: {
        LINK: { operationId: 'linkDevice', security: [{ DevicesOAuth: [] }], responses: ok },
      },
    },
  },
  components: {
    securitySchemes: {
      HealthOAuth: oauth({ password: passwordFlow }),
      StatusOAuth: oauth({ password: passwordFlow }),
      MeOAuth: oauth({ implicit: implicitFlow }),
      DevicesOAuth: oauth({ authorizationCode: codeFlow }),
    },
  },
};
