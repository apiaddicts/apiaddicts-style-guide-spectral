const scopes = { 'profile:read': 'Read profiles' };
const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Customer Identity API', version: '3.2.0' },
  servers: [{ url: 'https://api.identity.example.com/v3' }],
  security: [{ WebOAuth: ['profile:read'] }],
  paths: {
    '/profiles': {
      get: { operationId: 'listProfiles', responses: ok },
      post: { operationId: 'createProfile', security: [{ ServiceOAuth: [] }, { BrowserOAuth: [] }], responses: ok },
    },
  },
  components: {
    securitySchemes: {
      WebOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'http://not-checked-by-this-rule/authorize',
            tokenUrl: 'https://login.identity.example.com:8443/oauth2/v1/token',
            refreshUrl: 'https://login.identity.example.com/oauth/refresh',
            scopes,
          },
          password: { tokenUrl: 'https://login.microsoftonline.com/contoso/oauth2/v2.0/token', scopes },
          'x-legacy-password': { tokenUrl: 'http://legacy/token', scopes },
        },
      },
      ServiceOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://oauth2.googleapis.com/token', scopes } } },
      BrowserOAuth: { type: 'oauth2', flows: { implicit: { authorizationUrl: 'http://not-checked/authorize', scopes } } },
      PartnerKey: { type: 'apiKey', in: 'header', name: 'X-Partner-Key', tokenUrl: 'http://partners.example.com' },
    },
  },
};
