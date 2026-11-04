const ok = { 200: { description: 'Ok' } };
const bad = (host) => ({ type: 'oauth2', flows: { clientCredentials: { tokenUrl: `http://${host}.retail.example.com/token`, scopes: {} } } });

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
          probeResult: { '{$request.query.callback}': { post: { security: [{ ProbeCallbackOAuth: [] }], responses: ok } } },
        },
        responses: ok,
      },
    },
    '/me': { get: { operationId: 'me', security: [{ MeOAuth: [] }], responses: ok } },
    '/ping': { get: { operationId: 'ping', responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ MonitoringOAuth: [] }, {}], responses: ok } },
    '/orders': { post: { operationId: 'createOrder', security: [{ OrdersOAuth: [] }], responses: ok } },
    '/catalog': { get: { operationId: 'catalog', security: [], responses: ok } },
  },
  components: {
    securitySchemes: {
      MonitoringOAuth: bad('monitoring'),
      ProbeCallbackOAuth: bad('probe'),
      MeOAuth: bad('me'),
      OrdersOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://login.retail.example.com/oauth/token', scopes: {} } } },
    },
  },
};
