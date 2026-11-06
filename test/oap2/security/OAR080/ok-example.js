const responses = { 200: { description: 'Ok' }, 401: { description: 'Unauthorized' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Retail Banking Accounts API', version: '4.2.0' },
  host: 'api.bank.example.com',
  basePath: '/retail/v4',
  schemes: ['https'],
  securityDefinitions: {
    bankOAuth: { type: 'oauth2', flow: 'accessCode', authorizationUrl: 'https://auth.bank.example.com/authorize', tokenUrl: 'https://auth.bank.example.com/token', scopes: { 'accounts:read': 'Read', 'accounts:write': 'Write' } },
    channelKey: { type: 'apiKey', in: 'header', name: 'X-Channel-Key' },
    tellerBasic: { type: 'basic' },
  },
  security: [{ bankOAuth: ['accounts:read'] }, { channelKey: [] }],
  paths: {
    '/accounts': {
      get: { operationId: 'listAccounts', security: [{ bankOAuth: ['accounts:read', 'accounts:write'] }], responses },
      post: { operationId: 'openAccount', security: [{ tellerBasic: [], channelKey: [] }], responses },
    },
    '/accounts/{accountId}': {
      get: { operationId: 'getAccount', responses },
      put: { operationId: 'replaceAccount', security: [{}, { tellerBasic: [] }], responses },
      delete: { operationId: 'closeAccount', security: [], responses },
      head: { operationId: 'checkAccount', security: { undeclaredScheme: [] }, responses },
      trace: { operationId: 'traceAccount', security: [{ undeclaredScheme: [] }], responses },
      query: { operationId: 'queryAccount', security: [{ undeclaredScheme: [] }], responses },
      patch: {
        operationId: 'updateAccount',
        security: [{ channelKey: [] }],
        responses,
        callbacks: { onUpdate: { '{$request.body#/url}': { post: { security: [{ undeclaredScheme: [] }] } } } },
      },
    },
    'x-teller-routes': { '/teller': { get: { security: [{ undeclaredScheme: [] }] } } },
  },
  'x-path-items': { Unused: { get: { operationId: 'unused', security: [{ undeclaredScheme: [] }], responses } } },
};
