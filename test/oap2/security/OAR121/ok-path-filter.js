const ok = { 200: { description: 'Ok' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.16.1' },
  host: 'api.petclinic.example.com',
  security: [{ MonitoringBasic: [] }],
  paths: {
    '/health': { get: { operationId: 'health', responses: ok } },
    '/ping': { get: { operationId: 'ping', responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ MonitoringBasic: [] }, {}], responses: ok } },
    '/me': { get: { operationId: 'me', security: [{ MeKey: [] }], responses: ok } },
    '/visits': {
      get: { operationId: 'listVisits', security: [{ VisitsOAuth: [] }], responses: ok },
      delete: { operationId: 'purgeVisits', security: [], responses: ok },
    },
  },
  securityDefinitions: {
    MonitoringBasic: { type: 'basic' },
    MeKey: { type: 'apiKey', in: 'header', name: 'X-Me-Key' },
    VisitsOAuth: { type: 'oauth2', flow: 'application', tokenUrl: 'https://auth.petclinic.example.com/token', scopes: {} },
  },
};
