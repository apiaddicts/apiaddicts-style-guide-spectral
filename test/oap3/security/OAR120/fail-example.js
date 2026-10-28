const AUTHORIZE = 'https://login.identity.example.com/oauth/authorize';
const scopes = { 'profile:read': 'Read profiles' };
const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Customer Identity API', version: '3.1.0', description: 'Customer profiles, consents and sessions.' },
  servers: [{ url: 'https://api.identity.example.com/v3' }],
  security: [{ WebOAuth: ['profile:read'] }],
  paths: {
    '/profiles': {
      get: { operationId: 'listProfiles', responses: ok },
      post: { operationId: 'createProfile', security: [{ PasswordOAuth: [] }, { KeycloakOAuth: [] }, { GoogleOAuth: [] }], responses: ok },
    },
    '/profiles/{profileId}': {
      parameters: [{ name: 'profileId', in: 'path', required: true, schema: { type: 'string' } }],
      get: { operationId: 'getProfile', security: [{ QueryOAuth: [] }, { AzureOAuth: [] }, { IntrospectOAuth: [] }], responses: ok },
      patch: { operationId: 'updateProfile', security: [{ CaseOAuth: [] }, { EmptyOAuth: [] }, { PartnerKey: [] }], responses: ok },
    },
  },
  components: {
    securitySchemes: {
      WebOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: AUTHORIZE,
            tokenUrl: 'http://login.identity.example.com/oauth/token',
            refreshUrl: 'http://not-checked/refresh',
            scopes,
          },
          clientCredentials: { tokenUrl: 'https://login.identity.example.com/oauth/token', scopes },
          implicit: { authorizationUrl: AUTHORIZE, scopes },
        },
      },
      PasswordOAuth: { type: 'oauth2', flows: { password: { tokenUrl: 'https://localhost/token', scopes } } },
      KeycloakOAuth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://sso.identity.example.com/realms/retail/protocol/openid-connect/token', scopes } },
      },
      GoogleOAuth: {
        type: 'oauth2',
        flows: { authorizationCode: { authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth', tokenUrl: 'https://oauth2.googleapis.com/token', scopes } },
      },
      QueryOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://login.identity.example.com/oauth/token?grant=client', scopes } } },
      AzureOAuth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://login.microsoftonline.com/contoso/oauth2/v2.0/token', scopes } },
      },
      IntrospectOAuth: { type: 'oauth2', flows: { password: { tokenUrl: 'https://login.identity.example.com/oauth/token/introspect', scopes } } },
      CaseOAuth: { type: 'OAuth2', flows: { clientCredentials: { tokenUrl: 'https://login.identity.example.com/OAuth/Token', scopes } } },
      EmptyOAuth: { type: 'oauth2', flows: { password: { tokenUrl: '', scopes } } },
      PartnerKey: { type: 'apiKey', in: 'header', name: 'X-Partner-Key', tokenUrl: 'http://partners.example.com' },
    },
  },
};
