const BAD = 'http://legacy/token';

module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.17.0' },
  host: 'api.petclinic.example.com',
  security: [
    { FlowsObject: [] },
    { NumericUrl: [] },
    { ObjectUrl: [] },
    { NoUrl: [] },
    { BasicWithUrl: [] },
    { NoType: [] },
  ],
  paths: {
    '/owners': { get: { operationId: 'listOwners', responses: { 200: { description: 'Owners' } } } },
  },
  securityDefinitions: {
    FlowsObject: { type: 'oauth2', flows: { password: { tokenUrl: BAD, scopes: {} } } },
    NumericUrl: { type: 'oauth2', flow: 'password', tokenUrl: 7, scopes: {} },
    ObjectUrl: { type: 'oauth2', flow: 'password', tokenUrl: { href: BAD }, scopes: {} },
    NoUrl: { type: 'oauth2', flow: 'implicit', authorizationUrl: 'http://legacy/authorize', scopes: {} },
    BasicWithUrl: { type: 'basic', tokenUrl: BAD },
    NoType: { flow: 'password', tokenUrl: BAD },
  },
};
