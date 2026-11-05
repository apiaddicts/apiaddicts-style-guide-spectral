const responses = { 200: { description: 'Ok' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Retail Banking Cards API', version: '2.0.0' },
  host: 'api.bank.example.com',
  basePath: '/cards/v2',
  securityDefinitions: {
    bankOAuth: { type: 'oauth2', flow: 'application', tokenUrl: 'https://auth.bank.example.com/token', scopes: { 'cards:read': 'Read' } },
    processorKey: { type: 'apiKey', in: 'header', name: 'X-Processor-Key' },
    tellerBasic: { type: 'basic' },
  },
  security: [{ bankOAuth: ['cards:read'], processorKey: [] }],
  paths: {
    '/cards': { $ref: '#/x-path-items/Cards' },
    '/legacy/cards': { $ref: '#/x-path-items/LegacyCards' },
    '/loop': { $ref: '#/paths/~1loop' },
    '/ghost': { $ref: '#/x-path-items/Missing' },
  },
  'x-path-items': {
    Cards: { get: { operationId: 'listCards', security: [{ processorKey: [] }, { tellerBasic: [] }], responses } },
    LegacyCards: { $ref: '#/x-path-items/Cards' },
    Unused: { get: { operationId: 'unused', security: [{ undeclaredScheme: [] }], responses } },
  },
};
