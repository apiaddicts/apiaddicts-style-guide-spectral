const ok = { 200: { description: 'Ok' } };
const implicitFlow = { authorizationUrl: 'https://auth.retail.example.com/authorize', scopes: {} };
const passwordFlow = { tokenUrl: 'https://auth.retail.example.com/token', scopes: {} };
const oauth = (flows) => ({ type: 'oauth2', flows });

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Retail Operations API', version: '3.2.0' },
  servers: [{ url: 'https://api.retail.example.com' }],
  paths: {
    '/health': {
      get: {
        operationId: 'health',
        security: [{ HealthOAuth: [] }],
        callbacks: {
          probeResult: {
            '{$request.query.callback}': { post: { security: [{ ProbeCallbackOAuth: [] }], responses: ok } },
          },
        },
        responses: ok,
      },
    },
    '/me': { get: { operationId: 'me', security: [{ MeOAuth: [] }], responses: ok } },
    '/ping': { get: { operationId: 'ping', security: [], responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ StatusOAuth: [] }], responses: ok } },
    '/reports': { get: { operationId: 'reports', security: [{ StatusOAuth: [] }], responses: ok } },
    '/v1/health': { get: { operationId: 'healthV1', security: [{ V1HealthOAuth: [] }], responses: ok } },
    '/orders': {
      post: {
        operationId: 'createOrder',
        security: [{ OrdersOAuth: [] }],
        callbacks: {
          orderShipped: {
            '{$request.body#/callbackUrl}': { post: { security: [{ OrderEventsOAuth: [] }], responses: ok } },
          },
        },
        responses: ok,
      },
    },
  },
  components: {
    securitySchemes: {
      HealthOAuth: oauth({ password: passwordFlow }),
      ProbeCallbackOAuth: oauth({ password: passwordFlow }),
      MeOAuth: oauth({ implicit: implicitFlow }),
      StatusOAuth: oauth({ password: passwordFlow }),
      V1HealthOAuth: oauth({ password: passwordFlow }),
      OrdersOAuth: oauth({ implicit: implicitFlow }),
      OrderEventsOAuth: oauth({ password: passwordFlow }),
      UnusedOAuth: oauth({ implicit: implicitFlow }),
    },
  },
};
