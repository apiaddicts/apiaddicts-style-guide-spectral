const ok = { 200: { description: 'Ok' } };
const implicitFlow = { authorizationUrl: 'https://auth.retail.example.com/authorize', scopes: {} };
const passwordFlow = { tokenUrl: 'https://auth.retail.example.com/token', scopes: {} };
const codeFlow = {
  authorizationUrl: 'https://auth.retail.example.com/authorize',
  tokenUrl: 'https://auth.retail.example.com/token',
  scopes: {},
};
const oauth = (flows) => ({ type: 'oauth2', flows });

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Retail Operations API', version: '3.2.1' },
  servers: [{ url: 'https://api.retail.example.com' }],
  security: [{ MonitoringOAuth: [] }],
  paths: {
    '/health': {
      get: {
        operationId: 'health',
        callbacks: {
          probeResult: {
            '{$request.query.callback}': { post: { security: [{ ProbeCallbackOAuth: [] }], responses: ok } },
          },
        },
        responses: ok,
      },
    },
    '/me': { get: { operationId: 'me', security: [{ MeOAuth: [] }], responses: ok } },
    '/ping': { get: { operationId: 'ping', responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ MonitoringOAuth: [] }, {}], responses: ok } },
    '/orders': {
      post: {
        operationId: 'createOrder',
        security: [{ OrdersOAuth: [] }],
        responses: ok,
      },
    },
    '/catalog': { get: { operationId: 'catalog', security: [], responses: ok } },
  },
  components: {
    securitySchemes: {
      MonitoringOAuth: oauth({ password: passwordFlow }),
      ProbeCallbackOAuth: oauth({ password: passwordFlow }),
      MeOAuth: oauth({ implicit: implicitFlow }),
      OrdersOAuth: oauth({ authorizationCode: codeFlow }),
    },
  },
};
