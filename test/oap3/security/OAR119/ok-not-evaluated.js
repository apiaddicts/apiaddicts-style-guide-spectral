const BAD = 'http://legacy/authorize';

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Media Library API', version: '1.0.0' },
  servers: [{ url: 'https://api.media.example.com' }],
  security: [
    { NumericUrl: [] },
    { NullUrl: [] },
    { ListUrl: [] },
    { ObjectUrl: [] },
    { NoUrl: [] },
    { FlowNotObject: [] },
    { FlowsArray: [] },
    { NoType: [] },
    { HttpWithFlows: [] },
    { LegacyFieldOnScheme: [] },
    { ExtensionFlow: [] },
  ],
  paths: {
    '/albums': { get: { operationId: 'listAlbums', responses: { 200: { description: 'Albums' } } } },
  },
  components: {
    securitySchemes: {
      NumericUrl: { type: 'oauth2', flows: { implicit: { authorizationUrl: 404, scopes: {} } } },
      NullUrl: { type: 'oauth2', flows: { implicit: { authorizationUrl: null, scopes: {} } } },
      ListUrl: { type: 'oauth2', flows: { implicit: { authorizationUrl: [BAD], scopes: {} } } },
      ObjectUrl: { type: 'oauth2', flows: { implicit: { authorizationUrl: { href: BAD }, scopes: {} } } },
      NoUrl: { type: 'oauth2', flows: { password: { tokenUrl: 'http://legacy/token', scopes: {} } } },
      FlowNotObject: { type: 'oauth2', flows: { implicit: BAD } },
      FlowsArray: { type: 'oauth2', flows: [{ implicit: { authorizationUrl: BAD } }] },
      NoType: { flows: { implicit: { authorizationUrl: BAD, scopes: {} } } },
      HttpWithFlows: { type: 'http', scheme: 'bearer', flows: { implicit: { authorizationUrl: BAD, scopes: {} } } },
      LegacyFieldOnScheme: { type: 'oauth2', flow: 'implicit', authorizationUrl: BAD, flows: {} },
      ExtensionFlow: { type: 'oauth2', flows: { 'x-implicit': { authorizationUrl: BAD, scopes: {} } } },
    },
  },
};
