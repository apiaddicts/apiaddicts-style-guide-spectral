const ok = { 200: { description: 'Ok' } };
const key = (name) => ({ type: 'apiKey', in: 'header', name: `X-${name}-Key` });

module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.16.0' },
  host: 'api.petclinic.example.com',
  security: [{ MonitoringKey: [] }],
  paths: {
    '/health': { get: { operationId: 'health', responses: ok } },
    '/status': { get: { operationId: 'status', security: [{ StatusKey: [] }], responses: ok } },
    '/me': { get: { operationId: 'me', security: [{ MeKey: [] }], responses: ok } },
    '/me/pets': { get: { operationId: 'myPets', security: [{ MyPetsKey: [] }], responses: ok } },
    '/visits': {
      get: { operationId: 'listVisits', security: [{ VisitsKey: [] }], responses: ok },
      delete: { operationId: 'purgeVisits', security: [{ StatusKey: [] }], responses: ok },
    },
  },
  securityDefinitions: {
    MonitoringKey: key('Monitoring'),
    StatusKey: key('Status'),
    MeKey: key('Me'),
    MyPetsKey: key('MyPets'),
    VisitsKey: key('Visits'),
    UnusedKey: key('Unused'),
  },
};
