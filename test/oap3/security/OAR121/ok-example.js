const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Partner Gateway API', version: '2.4.0' },
  servers: [{ url: 'https://gateway.partners.example.com/v2' }],
  security: [{ PartnerOAuth: [] }, { ServiceBearer: [] }],
  paths: {
    '/orders': {
      get: { operationId: 'listOrders', responses: ok },
      post: { operationId: 'createOrder', security: [{ PartnerOAuth: ['orders:write'], CapsBearer: [] }], responses: ok },
    },
    '/catalog': { get: { operationId: 'listCatalog', security: [], responses: ok } },
  },
  components: {
    securitySchemes: {
      PartnerOAuth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://auth.partners.example.com/oauth/token', scopes: { 'orders:write': 'Create orders' } } },
      },
      ServiceBearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      CapsBearer: { type: 'HTTP', scheme: ' BEARER ' },
    },
  },
};
