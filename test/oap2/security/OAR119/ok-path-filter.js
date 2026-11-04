const ok = { 200: { description: 'Ok' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.16.1' },
  host: 'api.petclinic.example.com',
  security: [{ MonitoringOAuth: [] }],
  paths: {
    '/health': { get: { operationId: 'health', responses: ok } },
    '/ping': { get: { operationId: 'ping', responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ MonitoringOAuth: [] }, {}], responses: ok } },
    '/me': { get: { operationId: 'me', security: [{ MeOAuth: [] }], responses: ok } },
    '/visits': {
      get: { operationId: 'listVisits', security: [{ VisitsOAuth: [] }], responses: ok },
      delete: { operationId: 'purgeVisits', security: [], responses: ok },
    },
  },
  securityDefinitions: {
    MonitoringOAuth: { type: 'oauth2', flow: 'implicit', authorizationUrl: 'http://monitoring.petclinic.example.com/authorize', scopes: {} },
    MeOAuth: { type: 'oauth2', flow: 'implicit', authorizationUrl: 'http://me.petclinic.example.com/authorize', scopes: {} },
    VisitsOAuth: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/authorize',
      tokenUrl: 'https://auth.petclinic.example.com/token',
      scopes: {},
    },
  },
};
