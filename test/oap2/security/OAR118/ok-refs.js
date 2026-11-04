module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.15.0' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  security: [{ OwnerOAuth: [] }, { Circular: [] }, { Dangling: [] }, { Undeclared: [] }],
  paths: {
    '/owners': { get: { operationId: 'listOwners', responses: { 200: { description: 'Owners' } } } },
  },
  securityDefinitions: {
    OwnerOAuth: { $ref: '#/securityDefinitions/OwnerOAuthBase' },
    OwnerOAuthBase: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: {},
    },
    Circular: { $ref: '#/securityDefinitions/CircularTwin' },
    CircularTwin: { $ref: '#/securityDefinitions/Circular' },
    Dangling: { $ref: '#/securityDefinitions/Nowhere' },
  },
};
