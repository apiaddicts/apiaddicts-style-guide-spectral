module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.17.0' },
  host: 'api.petclinic.example.com',
  security: [
    { FlowsObject: [] },
    { NumericFlow: [] },
    { ListFlow: [] },
    { BlankFlow: [] },
    { NoFlow: [] },
    { BasicWithFlow: [] },
    { ApiKeyWithFlow: [] },
  ],
  paths: {
    '/owners': { get: { operationId: 'listOwners', responses: { 200: { description: 'Owners' } } } },
  },
  securityDefinitions: {
    FlowsObject: {
      type: 'oauth2',
      flows: { implicit: { authorizationUrl: 'https://auth.petclinic.example.com/authorize', scopes: {} } },
    },
    NumericFlow: { type: 'oauth2', flow: 7, scopes: {} },
    ListFlow: { type: 'oauth2', flow: ['implicit', 'password'], scopes: {} },
    BlankFlow: { type: 'oauth2', flow: '   ', scopes: {} },
    NoFlow: { type: 'oauth2', scopes: {} },
    BasicWithFlow: { type: 'basic', flow: 'implicit' },
    ApiKeyWithFlow: { type: 'apiKey', in: 'query', name: 'key', flow: 'password' },
  },
};
