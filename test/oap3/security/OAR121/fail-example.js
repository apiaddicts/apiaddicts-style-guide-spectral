const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Partner Gateway API', version: '2.3.0', description: 'Orders, invoices and catalogue access for partners.' },
  servers: [{ url: 'https://gateway.partners.example.com/v2' }],
  security: [{ PartnerOAuth: [] }, { ServiceBearer: [] }],
  paths: {
    '/orders': {
      get: { operationId: 'listOrders', responses: ok },
      post: { operationId: 'createOrder', security: [{ LegacyBasic: [] }, { DigestAuth: [] }, { CapsBearer: [] }], responses: ok },
    },
    '/invoices': {
      get: { operationId: 'listInvoices', security: [{ HeaderKey: [], CorporateSso: [] }], responses: ok },
    },
    '/catalog': {
      get: { operationId: 'listCatalog', security: [{ HttpNoScheme: [] }, { TypeCase: [] }, { MtlsIn30: [] }, { PaddedType: [] }], responses: ok },
    },
  },
  components: {
    securitySchemes: {
      PartnerOAuth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://auth.partners.example.com/oauth/token', scopes: {} } },
      },
      ServiceBearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      CapsBearer: { type: 'http', scheme: 'Bearer' },
      LegacyBasic: { type: 'http', scheme: 'basic' },
      DigestAuth: { type: 'http', scheme: 'digest' },
      HeaderKey: { type: 'apiKey', in: 'header', name: 'X-Partner-Key' },
      CorporateSso: { type: 'openIdConnect', openIdConnectUrl: 'https://sso.partners.example.com/.well-known/openid-configuration' },
      HttpNoScheme: { type: 'http' },
      TypeCase: { type: 'OAuth2', flows: { clientCredentials: { tokenUrl: 'https://auth.partners.example.com/oauth/token', scopes: {} } } },
      MtlsIn30: { type: 'mutualTLS' },
      PaddedType: { type: ' apiKey ', in: 'query', name: 'key' },
    },
  },
};
