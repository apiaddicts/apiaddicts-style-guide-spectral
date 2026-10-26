module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.14.0' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  paths: {
    '/owners': {
      get: { operationId: 'listOwners', security: [{ OwnerOAuth: [] }], responses: { 200: { description: 'Owners' } } },
    },
    '/owners/{ownerId}': { $ref: '#/x-path-items/OwnerDetail' },
  },
  'x-path-items': {
    OwnerDetail: {
      get: {
        operationId: 'getOwner',
        parameters: [{ name: 'ownerId', in: 'path', required: true, type: 'string' }],
        security: [{ SharedOAuth: [] }],
        responses: { 200: { description: 'Owner' }, 404: { description: 'Not found' } },
      },
    },
  },
  securityDefinitions: {
    OwnerOAuth: { $ref: '#/securityDefinitions/OwnerOAuthLegacy' },
    OwnerOAuthLegacy: { $ref: '#/securityDefinitions/OwnerOAuthBase' },
    OwnerOAuthBase: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      scopes: {},
    },
    SharedOAuth: { $ref: '#/x-shared-security/CorporatePassword' },
  },
  'x-shared-security': {
    CorporatePassword: {
      type: 'oauth2',
      flow: 'password',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: {},
    },
  },
};
