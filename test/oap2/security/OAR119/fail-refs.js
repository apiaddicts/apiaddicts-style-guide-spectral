module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.14.0' },
  host: 'api.petclinic.example.com',
  paths: {
    '/owners': { get: { operationId: 'listOwners', security: [{ OwnerOAuth: [] }], responses: { 200: { description: 'Owners' } } } },
    '/owners/{ownerId}': { $ref: '#/x-path-items/OwnerDetail' },
  },
  'x-path-items': {
    OwnerDetail: {
      get: {
        operationId: 'getOwner',
        parameters: [{ name: 'ownerId', in: 'path', required: true, type: 'string' }],
        security: [{ SharedOAuth: [] }],
        responses: { 200: { description: 'Owner' } },
      },
    },
  },
  securityDefinitions: {
    OwnerOAuth: { $ref: '#/securityDefinitions/OwnerOAuthLegacy' },
    OwnerOAuthLegacy: { $ref: '#/securityDefinitions/OwnerOAuthBase' },
    OwnerOAuthBase: { type: 'oauth2', flow: 'implicit', authorizationUrl: 'https://legacy.petclinic.example.com/login', scopes: {} },
    SharedOAuth: { $ref: '#/x-shared-security/CorporateCode' },
  },
  'x-shared-security': {
    CorporateCode: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'http://corporate.petclinic.example.com/authorize',
      tokenUrl: 'https://corporate.petclinic.example.com/token',
      scopes: {},
    },
  },
};
