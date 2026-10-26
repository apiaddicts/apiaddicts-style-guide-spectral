const ok = { 200: { description: 'Ok' } };
const implicit = (name) => ({
  type: 'oauth2',
  flow: 'implicit',
  authorizationUrl: `https://auth.petclinic.example.com/${name}/authorize`,
  scopes: {},
});
const password = (name) => ({
  type: 'oauth2',
  flow: 'password',
  tokenUrl: `https://auth.petclinic.example.com/${name}/token`,
  scopes: {},
});

module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.16.0' },
  host: 'api.petclinic.example.com',
  security: [{ MonitoringOAuth: [] }],
  paths: {
    '/health': { get: { operationId: 'health', responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ StatusOAuth: [] }], responses: ok } },
    '/me': { get: { operationId: 'me', security: [{ MeOAuth: [] }], responses: ok } },
    '/me/pets': { get: { operationId: 'myPets', security: [{ MyPetsOAuth: [] }], responses: ok } },
    '/visits': {
      get: { operationId: 'listVisits', security: [{ VisitsOAuth: [] }], responses: ok },
      delete: { operationId: 'purgeVisits', security: [{ StatusOAuth: [] }], responses: ok },
    },
  },
  securityDefinitions: {
    MonitoringOAuth: password('monitoring'),
    StatusOAuth: password('status'),
    MeOAuth: implicit('me'),
    MyPetsOAuth: implicit('pets'),
    VisitsOAuth: implicit('visits'),
    UnusedOAuth: password('unused'),
  },
};
