module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.15.0' },
  host: 'api.petclinic.example.com',
  security: [{ OwnerOAuth: [] }, { Circular: [] }, { Dangling: [] }, { Undeclared: [] }],
  paths: {
    '/owners': { get: { operationId: 'listOwners', responses: { 200: { description: 'Owners' } } } },
  },
  securityDefinitions: {
    OwnerOAuth: { $ref: '#/securityDefinitions/OwnerOAuthBase' },
    OwnerOAuthBase: { type: 'oauth2', flow: 'application', tokenUrl: 'https://auth.petclinic.example.com/oauth/token', scopes: {} },
    Circular: { $ref: '#/securityDefinitions/CircularTwin' },
    CircularTwin: { $ref: '#/securityDefinitions/Circular' },
    Dangling: { $ref: '#/securityDefinitions/Nowhere' },
  },
};
