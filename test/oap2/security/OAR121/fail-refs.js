module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.14.0' },
  host: 'api.petclinic.example.com',
  paths: {
    '/owners': { get: { operationId: 'listOwners', security: [{ OwnerBasic: [] }], responses: { 200: { description: 'Owners' } } } },
    '/owners/{ownerId}': { $ref: '#/x-path-items/OwnerDetail' },
  },
  'x-path-items': {
    OwnerDetail: {
      get: {
        operationId: 'getOwner',
        parameters: [{ name: 'ownerId', in: 'path', required: true, type: 'string' }],
        security: [{ SharedKey: [] }],
        responses: { 200: { description: 'Owner' } },
      },
    },
  },
  securityDefinitions: {
    OwnerBasic: { $ref: '#/securityDefinitions/OwnerBasicLegacy' },
    OwnerBasicLegacy: { $ref: '#/securityDefinitions/OwnerBasicBase' },
    OwnerBasicBase: { type: 'basic' },
    SharedKey: { $ref: '#/x-shared-security/CorporateKey' },
  },
  'x-shared-security': {
    CorporateKey: { type: 'apiKey', in: 'header', name: 'X-Corporate-Key' },
  },
};
