const BAD = 'http://legacy/token';

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Media Library API', version: '1.0.0' },
  servers: [{ url: 'https://api.media.example.com' }],
  security: [
    { NumericUrl: [] },
    { NullUrl: [] },
    { ListUrl: [] },
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
      NumericUrl: { type: 'oauth2', flows: { password: { tokenUrl: 401, scopes: {} } } },
      NullUrl: { type: 'oauth2', flows: { password: { tokenUrl: null, scopes: {} } } },
      ListUrl: { type: 'oauth2', flows: { password: { tokenUrl: [BAD], scopes: {} } } },
      NoUrl: { type: 'oauth2', flows: { implicit: { authorizationUrl: 'http://legacy/authorize', refreshUrl: BAD, scopes: {} } } },
      FlowNotObject: { type: 'oauth2', flows: { password: BAD } },
      FlowsArray: { type: 'oauth2', flows: [{ password: { tokenUrl: BAD } }] },
      NoType: { flows: { password: { tokenUrl: BAD, scopes: {} } } },
      HttpWithFlows: { type: 'http', scheme: 'bearer', flows: { password: { tokenUrl: BAD, scopes: {} } } },
      LegacyFieldOnScheme: { type: 'oauth2', flow: 'password', tokenUrl: BAD, flows: {} },
      ExtensionFlow: { type: 'oauth2', flows: { 'x-password': { tokenUrl: BAD, scopes: {} } } },
    },
  },
};
