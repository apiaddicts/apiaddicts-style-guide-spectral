const BAD = 'http://legacy/authorize';

module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.17.0' },
  host: 'api.petclinic.example.com',
  security: [
    { FlowsObject: [] },
    { NumericUrl: [] },
    { ListUrl: [] },
    { NoUrl: [] },
    { BasicWithUrl: [] },
    { NoType: [] },
  ],
  paths: {
    '/owners': { get: { operationId: 'listOwners', responses: { 200: { description: 'Owners' } } } },
  },
  securityDefinitions: {
    FlowsObject: { type: 'oauth2', flows: { implicit: { authorizationUrl: BAD, scopes: {} } } },
    NumericUrl: { type: 'oauth2', flow: 'implicit', authorizationUrl: 7, scopes: {} },
    ListUrl: { type: 'oauth2', flow: 'implicit', authorizationUrl: [BAD], scopes: {} },
    NoUrl: { type: 'oauth2', flow: 'password', tokenUrl: 'http://legacy/token', scopes: {} },
    BasicWithUrl: { type: 'basic', authorizationUrl: BAD },
    NoType: { flow: 'implicit', authorizationUrl: BAD },
  },
};
