module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Customer Loyalty API',
    version: '2.4.1',
    description: 'Loyalty points, rewards catalogue and partner redemptions.',
  },
  servers: [{ url: 'https://api.loyalty.example.com/v2' }],
  security: [{ CustomerOAuth: ['loyalty:read'] }],
  paths: {
    '/members': {
      get: {
        operationId: 'listMembers',
        summary: 'List loyalty members',
        responses: { 200: { description: 'A page of members' } },
      },
      post: {
        operationId: 'enrollMember',
        summary: 'Enroll a new member',
        security: [{ CustomerOAuth: ['loyalty:write'] }, { BearerAuth: [] }],
        responses: { 201: { description: 'Member enrolled' } },
      },
    },
    '/partners/redemptions': {
      post: {
        operationId: 'createRedemption',
        summary: 'Redeem points at a partner',
        security: [{ PartnerOAuth: ['redemptions:write'], PartnerApiKey: [] }],
        responses: { 202: { description: 'Redemption accepted' } },
      },
    },
    '/campaigns': {
      get: {
        operationId: 'listCampaigns',
        summary: 'List active campaigns',
        security: [{ CorporateSso: ['openid'] }],
        responses: { 200: { description: 'Active campaigns' } },
      },
    },
  },
  components: {
    securitySchemes: {
      CustomerOAuth: {
        type: 'oauth2',
        description: 'Customer-facing OAuth 2.0 server.',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://auth.loyalty.example.com/oauth/authorize',
            tokenUrl: 'https://auth.loyalty.example.com/oauth/token',
            refreshUrl: 'https://auth.loyalty.example.com/oauth/refresh',
            scopes: { 'loyalty:read': 'Read loyalty data', 'loyalty:write': 'Manage memberships' },
          },
          clientCredentials: {
            tokenUrl: 'https://auth.loyalty.example.com/oauth/token',
            scopes: { 'loyalty:read': 'Read loyalty data' },
          },
          'x-implicit-deprecated': {
            authorizationUrl: 'https://auth.loyalty.example.com/oauth/authorize',
            scopes: {},
          },
        },
      },
      PartnerOAuth: {
        type: 'oauth2',
        flows: {
          clientCredentials: {
            tokenUrl: 'https://auth.loyalty.example.com/oauth/token',
            scopes: { 'redemptions:write': 'Create redemptions' },
          },
        },
      },
      BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      PartnerApiKey: { type: 'apiKey', in: 'header', name: 'X-Partner-Key' },
      CorporateSso: { type: 'openIdConnect', openIdConnectUrl: 'https://sso.example.com/.well-known/openid-configuration' },
    },
  },
};
