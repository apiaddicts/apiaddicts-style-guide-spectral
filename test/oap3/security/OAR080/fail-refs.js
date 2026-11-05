const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Corporate Banking API', version: '5.1.0' },
  servers: [{ url: 'https://api.bank.example.com/corporate/v5' }],
  security: [{ corporateOAuth: ['accounts:read'] }],
  paths: {
    '/accounts': { $ref: '#/x-path-templates/Accounts' },
    '/v1/accounts': { $ref: '#/x-path-templates/Accounts' },
    '/legacy/accounts': { $ref: '#/x-path-templates/LegacyAccounts' },
    '/statements': {
      $ref: '#/x-path-templates/Statements',
      post: { operationId: 'requestStatement', security: [{ adminBearer: [] }], responses },
    },
    '/reports': { $ref: '#/x-path-templates/Reports%20v2' },
    '/files': { $ref: '#/x-path-templates/~1files~1{fileId}' },
    '/ghost': { $ref: '#/x-path-templates/Missing' },
    '/transfers': {
      post: {
        operationId: 'createTransfer',
        responses,
        callbacks: {
          onTransfer: { $ref: '#/components/callbacks/TransferEvent' },
          onStatus: { '{$request.body#/statusUrl}': { $ref: '#/x-path-templates/StatusCallback' } },
          onLoop: { $ref: '#/components/callbacks/Loop' },
        },
      },
    },
    '/transfers/bulk': {
      post: {
        operationId: 'createBulkTransfer',
        responses,
        callbacks: { onTransfer: { $ref: '#/components/callbacks/TransferEvent' } },
      },
    },
  },
  'x-path-templates': {
    Accounts: {
      get: { operationId: 'listAccounts', security: [{ corporateOAuth: [] }, { partnerBasic: [] }, { cardKey: [] }], responses },
    },
    LegacyAccounts: { $ref: '#/x-path-templates/Accounts' },
    Statements: { get: { operationId: 'listStatements', security: [{ legacyKey: [] }], responses } },
    'Reports v2': { get: { operationId: 'listReports', security: [{ reportKey: [] }], responses } },
    '/files/{fileId}': { get: { operationId: 'getFile', security: [{ fileKey: [] }], responses } },
    StatusCallback: { post: { operationId: 'statusCallback', security: [{ statusKey: [] }], responses } },
  },
  components: {
    securitySchemes: {
      corporateOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://auth.bank.example.com/token', scopes: { 'accounts:read': 'Read' } } } },
      partnerBasic: { type: 'http', scheme: 'basic' },
    },
    callbacks: {
      TransferEvent: {
        '{$request.body#/callbackUrl}': {
          post: { operationId: 'transferEventCallback', security: [{ signatureKey: [] }], responses },
        },
      },
      Loop: {
        '{$request.body#/loopUrl}': {
          post: {
            operationId: 'loopCallback',
            security: [{ loopKey: [] }],
            responses,
            callbacks: { again: { $ref: '#/components/callbacks/Loop' } },
          },
        },
      },
    },
  },
};
