const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Retail Operations API', version: '3.2.1' },
  servers: [{ url: 'https://api.retail.example.com' }],
  security: [{ MonitoringKey: [] }],
  paths: {
    '/health': {
      get: {
        operationId: 'health',
        callbacks: {
          probeResult: { '{$request.query.callback}': { post: { security: [{ ProbeBasic: [] }], responses: ok } } },
        },
        responses: ok,
      },
    },
    '/me': { get: { operationId: 'me', security: [{ MeSso: [] }], responses: ok } },
    '/ping': { get: { operationId: 'ping', responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ MonitoringKey: [] }, {}], responses: ok } },
    '/orders': { post: { operationId: 'createOrder', security: [{ OrdersOAuth: [] }], responses: ok } },
    '/catalog': { get: { operationId: 'catalog', security: [], responses: ok } },
  },
  components: {
    securitySchemes: {
      MonitoringKey: { type: 'apiKey', in: 'header', name: 'X-Monitoring-Key' },
      ProbeBasic: { type: 'http', scheme: 'basic' },
      MeSso: { type: 'openIdConnect', openIdConnectUrl: 'https://sso.retail.example.com/.well-known/openid-configuration' },
      OrdersOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://login.retail.example.com/oauth/token', scopes: {} } } },
    },
  },
};
