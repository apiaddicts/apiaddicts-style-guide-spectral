const responses = { 200: { description: 'Ok' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Retail Banking Cards API', version: '2.0.0' },
  host: 'api.bank.example.com',
  basePath: '/cards/v2',
  securityDefinitions: {
    bankOAuth: { type: 'oauth2', flow: 'application', tokenUrl: 'https://auth.bank.example.com/token', scopes: { 'cards:read': 'Read' } },
    tellerBasic: { type: 'basic' },
  },
  security: [{ bankOAuth: ['cards:read'] }],
  paths: {
    '/cards': { $ref: '#/x-path-items/Cards' },
    '/v1/cards': { $ref: '#/x-path-items/Cards' },
    '/legacy/cards': { $ref: '#/x-path-items/LegacyCards' },
    '/cards/{cardId}/blocks': {
      $ref: '#/x-path-items/Blocks',
      post: { operationId: 'blockCard', security: [{ branchBasic: [] }], responses },
    },
    '/cards/{cardId}/pins': { $ref: '#/x-path-items/Pin%20Changes' },
    '/ghost': { $ref: '#/x-path-items/Missing' },
  },
  'x-path-items': {
    Cards: { get: { operationId: 'listCards', security: [{ processorKey: [] }], responses } },
    LegacyCards: { $ref: '#/x-path-items/Cards' },
    Blocks: { delete: { operationId: 'unblockCard', security: [{ bankOAuth: [] }, { tellerBasic: [] }, { vaultKey: [] }], responses } },
    'Pin Changes': { put: { operationId: 'changePin', security: [{ pinPad: [] }], responses } },
  },
};
