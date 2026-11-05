const responses = { 200: { description: 'Ok' }, 401: { description: 'Unauthorized' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Retail Banking Accounts API', version: '4.2.0' },
  host: 'api.bank.example.com',
  basePath: '/retail/v4',
  schemes: ['https'],
  securityDefinitions: {
    bankOAuth: { type: 'oauth2', flow: 'accessCode', authorizationUrl: 'https://auth.bank.example.com/authorize', tokenUrl: 'https://auth.bank.example.com/token', scopes: { 'accounts:read': 'Read' } },
    channelKey: { type: 'apiKey', in: 'header', name: 'X-Channel-Key' },
    tellerBasic: { type: 'basic' },
  },
  security: [{ bankOAuth: ['accounts:read'] }, {}, { channelKey: [] }, { branchKey: [] }],
  paths: {
    '/accounts': {
      get: { operationId: 'listAccounts', security: [{ bankOAuth: ['accounts:read'] }], responses },
      post: { operationId: 'openAccount', security: [{ tellerBasic: [] }], responses },
    },
    '/accounts/{accountId}': {
      get: { operationId: 'getAccount', responses },
      put: { operationId: 'replaceAccount', security: [{ channelKey: [], tellerBasic: [], auditKey: [] }], responses },
      patch: { operationId: 'updateAccount', security: [{ ChannelKey: [] }], responses },
      delete: { operationId: 'closeAccount', security: [{}, { legacyKey: [] }], responses },
      head: { operationId: 'checkAccount', security: [{ undeclaredScheme: [] }], responses },
      options: { operationId: 'accountOptions', security: [{ bankOAuth: [] }, { atmKey: [] }], responses },
    },
    '/accounts/{accountId}/statements': {
      get: { operationId: 'listStatements', security: [{ '#/securityDefinitions/channelKey': [] }], responses },
    },
  },
};
