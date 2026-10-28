const ok = { 200: { description: 'Ok' } };
const bad = (host) => ({ type: 'oauth2', flows: { implicit: { authorizationUrl: `http://${host}.retail.example.com/authorize`, scopes: {} } } });

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
          probeResult: { '{$request.query.callback}': { post: { security: [{ ProbeCallbackOAuth: [] }], responses: ok } } },
        },
        responses: ok,
      },
    },
    '/me': { get: { operationId: 'me', security: [{ MeOAuth: [] }], responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ StatusOAuth: [] }], responses: ok } },
    '/reports': { get: { operationId: 'reports', security: [{ StatusOAuth: [] }], responses: ok } },
    '/v1/health': { get: { operationId: 'healthV1', security: [{ V1HealthOAuth: [] }], responses: ok } },
    '/orders': {
      post: {
        operationId: 'createOrder',
        security: [{ OrdersOAuth: [] }],
        callbacks: {
          orderShipped: { '{$request.body#/callbackUrl}': { post: { security: [{ OrderEventsOAuth: [] }], responses: ok } } },
        },
        responses: ok,
      },
    },
  },
  components: {
    securitySchemes: {
      HealthOAuth: bad('health'),
      ProbeCallbackOAuth: bad('probe'),
      MeOAuth: bad('me'),
      StatusOAuth: bad('status'),
      V1HealthOAuth: bad('v1-health'),
      OrdersOAuth: bad('orders'),
      OrderEventsOAuth: bad('order-events'),
      UnusedOAuth: bad('unused'),
    },
  },
};
