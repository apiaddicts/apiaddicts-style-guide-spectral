const ok = { 200: { description: 'Ok' } };
const implicitFlow = { authorizationUrl: 'https://auth.home.example.com/authorize', scopes: {} };
const passwordFlow = { tokenUrl: 'https://auth.home.example.com/token', scopes: {} };
const oauth = (flows) => ({ type: 'oauth2', flows });

module.exports = {
  openapi: '3.2.0',
  info: { title: 'Smart Home Devices API', version: '1.5.0' },
  servers: [{ url: 'https://api.home.example.com/v1' }],
  paths: {
    '/health': {
      get: {
        operationId: 'health',
        security: [{ '#/components/securitySchemes/HealthOAuth': [] }, { SharedOAuth: [] }],
        responses: ok,
      },
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
        security: [
          { '#/components/securitySchemes/SharedOAuth': [] },
          { './shared-security.yaml#/components/securitySchemes/External': [] },
          { '#/components/securitySchemes/Missing': [] },
        ],
        responses: ok,
      },
      additionalOperations: {
        LINK: { operationId: 'linkDevice', security: [{ LinkOAuth: [] }], responses: ok },
      },
    },
  },
  components: {
    securitySchemes: {
      HealthOAuth: oauth({ password: passwordFlow }),
      StatusOAuth: oauth({ password: passwordFlow }),
      MeOAuth: oauth({ implicit: implicitFlow }),
      SharedOAuth: oauth({ password: passwordFlow }),
      LinkOAuth: oauth({ implicit: implicitFlow }),
    },
  },
};
