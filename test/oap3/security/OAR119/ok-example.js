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
      post: { operationId: 'createProfile', security: [{ TenantOAuth: [] }, { ShortPathOAuth: [] }], responses: ok },
    },
    '/consents': { get: { operationId: 'listConsents', security: [{ ServiceOAuth: [] }, { PartnerKey: [] }], responses: ok } },
  },
  components: {
    securitySchemes: {
      WebOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://login.identity.example.com/oauth/authorize',
            tokenUrl: 'http://not-checked-by-this-rule/token',
            refreshUrl: 'ftp://not-checked-either',
            scopes,
          },
          implicit: { authorizationUrl: 'https://login.identity.example.com:8443/oauth2/v1/authorize', scopes },
          'x-legacy-implicit': { authorizationUrl: 'http://legacy/authorize', scopes },
        },
      },
      TenantOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://login.microsoftonline.com/contoso/oauth2/v2.0/authorize',
            tokenUrl: 'https://login.microsoftonline.com/contoso/oauth2/v2.0/token',
            scopes,
          },
        },
      },
      ShortPathOAuth: { type: 'oauth2', flows: { implicit: { authorizationUrl: 'https://tenant.auth0.com/authorize', scopes } } },
      ServiceOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://login.identity.example.com/oauth/token', scopes } } },
      PartnerKey: { type: 'apiKey', in: 'header', name: 'X-Partner-Key', authorizationUrl: 'http://partners.example.com' },
      Sso: { type: 'openIdConnect', openIdConnectUrl: 'http://sso.example.com/.well-known/openid-configuration' },
    },
  },
};
