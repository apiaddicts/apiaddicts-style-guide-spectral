const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Corporate Banking API', version: '5.1.0' },
  servers: [{ url: 'https://api.bank.example.com/corporate/v5' }],
  security: [{ corporateOAuth: ['accounts:read'] }, { corporateKey: [] }],
  paths: {
    '/accounts': { $ref: '#/x-path-templates/Accounts' },
    '/legacy/accounts': { $ref: '#/x-path-templates/LegacyAccounts' },
    '/loop': { $ref: '#/paths/~1loop' },
    '/self-chain': { $ref: '#/x-path-templates/ChainA' },
    '/ghost': { $ref: '#/x-path-templates/Missing' },
    '/elsewhere': { $ref: 'not-a-local-pointer' },
    '/transfers': {
      post: {
        operationId: 'createTransfer',
        responses,
        callbacks: {
          onTransfer: { $ref: '#/components/callbacks/TransferEvent' },
          onLoop: { $ref: '#/components/callbacks/Loop' },
          onMissing: { $ref: '#/components/callbacks/Missing' },
        },
      },
    },
  },
  'x-path-templates': {
    Accounts: { get: { operationId: 'listAccounts', security: [{ corporateOAuth: [] }, { partnerBasic: [] }], responses } },
    LegacyAccounts: { $ref: '#/x-path-templates/Accounts' },
    ChainA: { $ref: '#/x-path-templates/ChainB' },
    ChainB: { $ref: '#/x-path-templates/ChainA' },
    Unused: { get: { operationId: 'unused', security: [{ undeclaredScheme: [] }], responses } },
  },
  components: {
    securitySchemes: {
      corporateOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://auth.bank.example.com/token', scopes: { 'accounts:read': 'Read' } } } },
      corporateKey: { type: 'apiKey', in: 'header', name: 'X-Corporate-Key' },
      partnerBasic: { type: 'http', scheme: 'basic' },
    },
    callbacks: {
      TransferEvent: { '{$request.body#/callbackUrl}': { post: { operationId: 'transferEventCallback', security: [{ partnerBasic: [] }], responses } } },
      Loop: {
        '{$request.body#/loopUrl}': {
          post: { operationId: 'loopCallback', responses, callbacks: { again: { $ref: '#/components/callbacks/Loop' } } },
        },
      },
      Unused: { '{$request.body#/url}': { post: { security: [{ undeclaredScheme: [] }], responses } } },
    },
  },
};
