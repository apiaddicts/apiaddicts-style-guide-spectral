const implicitFlow = { authorizationUrl: 'https://auth.media.example.com/authorize', scopes: {} };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Media Library API', version: '1.0.0' },
  servers: [{ url: 'https://api.media.example.com' }],
  security: [
    { ApiKeyWithFlows: [] },
    { HttpWithFlows: [] },
    { OpenIdWithFlows: [] },
    { LegacyFlowField: [] },
    { NoFlows: [] },
    { NullFlows: [] },
    { ArrayFlows: [] },
    { NoType: [] },
    { NumericType: [] },
    { ExtensionOnly: [] },
    { BlankFlowKey: [] },
    { NotAnObject: [] },
  ],
  paths: {
    '/albums': { get: { operationId: 'listAlbums', responses: { 200: { description: 'Albums' } } } },
  },
  components: {
    securitySchemes: {
      ApiKeyWithFlows: { type: 'apiKey', in: 'header', name: 'X-Api-Key', flows: { implicit: implicitFlow } },
      HttpWithFlows: { type: 'http', scheme: 'bearer', flows: { implicit: implicitFlow } },
      OpenIdWithFlows: { type: 'openIdConnect', openIdConnectUrl: 'https://sso.media.example.com/.well-known/openid-configuration', flows: { implicit: implicitFlow } },
      LegacyFlowField: { type: 'oauth2', flow: 'implicit', authorizationUrl: 'https://auth.media.example.com/authorize', scopes: {} },
      NoFlows: { type: 'oauth2' },
      NullFlows: { type: 'oauth2', flows: null },
      ArrayFlows: { type: 'oauth2', flows: [{ implicit: implicitFlow }] },
      NoType: { flows: { implicit: implicitFlow } },
      NumericType: { type: 2, flows: { implicit: implicitFlow } },
      ExtensionOnly: { type: 'oauth2', flows: { 'x-implicit': implicitFlow, 'x-password': { tokenUrl: 'https://auth.media.example.com/token' } } },
      BlankFlowKey: { type: 'oauth2', flows: { '': implicitFlow, '  ': implicitFlow } },
      NotAnObject: 'oauth2',
    },
  },
};
