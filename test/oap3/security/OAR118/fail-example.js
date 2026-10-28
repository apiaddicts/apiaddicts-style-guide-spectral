module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Customer Loyalty API',
    version: '2.4.0',
    description: 'Loyalty points, rewards catalogue and partner redemptions.',
  },
  servers: [{ url: 'https://api.loyalty.example.com/v2' }],
  security: [{ CustomerOAuth: ['loyalty:read'] }],
  tags: [{ name: 'Members' }, { name: 'Partners' }, { name: 'Campaigns' }],
  paths: {
    '/members': {
      get: {
        tags: ['Members'],
        operationId: 'listMembers',
        summary: 'List loyalty members',
        parameters: [{ name: '$limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } }],
        responses: {
          200: {
            description: 'A page of members',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MemberPage' } } },
          },
        },
      },
      post: {
        tags: ['Members'],
        operationId: 'enrollMember',
        summary: 'Enroll a new member',
        security: [{ CustomerOAuth: ['loyalty:write'] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Member' } } },
        },
        responses: { 201: { description: 'Member enrolled' } },
      },
    },
    '/members/{memberId}/points': {
      parameters: [{ name: 'memberId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      get: {
        tags: ['Members'],
        operationId: 'getMemberPoints',
        summary: 'Get the points balance of a member',
        responses: {
          200: {
            description: 'Points balance',
            content: { 'application/json': { schema: { type: 'object', properties: { balance: { type: 'integer' } } } } },
          },
          404: { description: 'Member not found' },
        },
      },
    },
    '/partners/redemptions': {
      post: {
        tags: ['Partners'],
        operationId: 'createRedemption',
        summary: 'Redeem points at a partner',
        security: [{ PartnerOAuth: ['redemptions:write'] }, { PartnerApiKey: [] }],
        responses: { 202: { description: 'Redemption accepted' } },
      },
    },
    '/campaigns': {
      get: {
        tags: ['Campaigns'],
        operationId: 'listCampaigns',
        summary: 'List active campaigns',
        security: [{ CampaignsOAuth: [] }],
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
          implicit: {
            authorizationUrl: 'https://auth.loyalty.example.com/oauth/authorize',
            scopes: { 'loyalty:read': 'Read loyalty data', 'loyalty:write': 'Manage memberships' },
          },
          authorizationCode: {
            authorizationUrl: 'https://auth.loyalty.example.com/oauth/authorize',
            tokenUrl: 'https://auth.loyalty.example.com/oauth/token',
            scopes: { 'loyalty:read': 'Read loyalty data', 'loyalty:write': 'Manage memberships' },
          },
          password: {
            tokenUrl: 'https://auth.loyalty.example.com/oauth/token',
            scopes: { 'loyalty:read': 'Read loyalty data' },
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
      CampaignsOAuth: {
        type: 'OAuth2',
        flows: {
          implicit: {
            authorizationUrl: 'https://auth.loyalty.example.com/oauth/authorize',
            scopes: {},
          },
          'x-token-lifetime': 3600,
        },
      },
      PartnerApiKey: { type: 'apiKey', in: 'header', name: 'X-Partner-Key' },
    },
    schemas: {
      Member: {
        type: 'object',
        required: ['email'],
        properties: {
          id: { type: 'string', format: 'uuid', readOnly: true },
          email: { type: 'string', format: 'email' },
          tier: { type: 'string', enum: ['silver', 'gold', 'platinum'] },
        },
      },
      MemberPage: {
        type: 'object',
        properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Member' } } },
      },
    },
  },
};
