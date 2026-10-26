const TOKEN = 'https://login.identity.example.com/oauth/token';
const code = (authorizationUrl) => ({ authorizationUrl, tokenUrl: TOKEN, scopes: { 'profile:read': 'Read profiles' } });
const implicit = (authorizationUrl) => ({ authorizationUrl, scopes: { 'profile:read': 'Read profiles' } });
const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Customer Identity API', version: '3.1.0', description: 'Customer profiles, consents and sessions.' },
  servers: [{ url: 'https://api.identity.example.com/v3' }],
  security: [{ WebOAuth: ['profile:read'] }],
  paths: {
    '/profiles': {
      get: { operationId: 'listProfiles', responses: ok },
      post: { operationId: 'createProfile', security: [{ MobileOAuth: [] }, { KeycloakOAuth: [] }], responses: ok },
    },
    '/profiles/{profileId}': {
      parameters: [{ name: 'profileId', in: 'path', required: true, schema: { type: 'string' } }],
      get: { operationId: 'getProfile', security: [{ QueryOAuth: [] }, { SlashOAuth: [] }, { PortOAuth: [] }], responses: ok },
      patch: { operationId: 'updateProfile', security: [{ CaseOAuth: [] }, { EmptyOAuth: [] }, { RelativeOAuth: [] }], responses: ok },
    },
    '/consents': {
      get: { operationId: 'listConsents', security: [{ TenantOAuth: [] }, { PartnerKey: [] }], responses: ok },
    },
  },
  components: {
    securitySchemes: {
      WebOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: code('http://login.identity.example.com/oauth/authorize'),
          implicit: implicit('https://login.identity.example.com/oauth/authorize'),
          clientCredentials: { tokenUrl: TOKEN, scopes: {} },
        },
      },
      MobileOAuth: { type: 'oauth2', flows: { implicit: implicit('https://localhost/authorize') } },
      KeycloakOAuth: {
        type: 'oauth2',
        flows: { authorizationCode: code('https://sso.identity.example.com/realms/retail/protocol/openid-connect/auth') },
      },
      QueryOAuth: { type: 'oauth2', flows: { authorizationCode: code('https://login.identity.example.com/oauth/authorize?prompt=login') } },
      SlashOAuth: { type: 'oauth2', flows: { implicit: implicit('https://login.identity.example.com/oauth/authorize/') } },
      PortOAuth: { type: 'oauth2', flows: { authorizationCode: code('https://login.identity.example.com:8443/oauth/authorize') } },
      CaseOAuth: { type: 'OAuth2', flows: { authorizationCode: code('HTTPS://LOGIN.identity.example.com/oauth/authorize') } },
      EmptyOAuth: { type: 'oauth2', flows: { implicit: implicit('') } },
      RelativeOAuth: { type: 'oauth2', flows: { authorizationCode: code('/oauth/authorize') } },
      TenantOAuth: {
        type: 'oauth2',
        flows: { authorizationCode: code('https://login.microsoftonline.com/contoso/oauth2/v2.0/authorize') },
      },
      PartnerKey: { type: 'apiKey', in: 'header', name: 'X-Partner-Key', authorizationUrl: 'http://partners.example.com' },
    },
  },
};
