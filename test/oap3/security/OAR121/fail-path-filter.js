const ok = { 200: { description: 'Ok' } };
const key = (name) => ({ type: 'apiKey', in: 'header', name: `X-${name}-Key` });

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Retail Operations API', version: '3.2.0' },
  servers: [{ url: 'https://api.retail.example.com' }],
  paths: {
    '/health': {
      get: {
        operationId: 'health',
        security: [{ HealthKey: [] }],
        callbacks: {
          probeResult: { '{$request.query.callback}': { post: { security: [{ ProbeCallbackKey: [] }], responses: ok } } },
        },
        responses: ok,
      },
    },
    '/me': { get: { operationId: 'me', security: [{ MeKey: [] }], responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ StatusKey: [] }], responses: ok } },
    '/reports': { get: { operationId: 'reports', security: [{ StatusKey: [] }], responses: ok } },
    '/v1/health': { get: { operationId: 'healthV1', security: [{ V1HealthKey: [] }], responses: ok } },
    '/orders': {
      post: {
        operationId: 'createOrder',
        security: [{ OrdersKey: [] }],
        callbacks: {
          orderShipped: { '{$request.body#/callbackUrl}': { post: { security: [{ OrderEventsKey: [] }], responses: ok } } },
        },
        responses: ok,
      },
    },
  },
  components: {
    securitySchemes: {
      HealthKey: key('Health'),
      ProbeCallbackKey: key('Probe'),
      MeKey: key('Me'),
      StatusKey: key('Status'),
      V1HealthKey: key('V1Health'),
      OrdersKey: key('Orders'),
      OrderEventsKey: key('OrderEvents'),
      UnusedKey: key('Unused'),
    },
  },
};
