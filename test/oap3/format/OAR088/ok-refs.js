const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Corporate Banking API', version: '5.1.0' },
  servers: [{ url: 'https://api.bank.example.com/corporate/v5' }],
  paths: {
    '/accounts': { $ref: '#/x-path-templates/Accounts' },
    '/v1/accounts': { $ref: '#/x-path-templates/Accounts' },
    '/legacy/accounts': { $ref: '#/x-path-templates/LegacyAccounts' },
    '/statements': {
      $ref: '#/x-path-templates/Statements',
      parameters: [{ $ref: '#/components/parameters/statementPeriodParam' }],
      post: { operationId: 'requestStatement', parameters: [{ $ref: '#/components/parameters/channelHeaderParam' }], responses: ok },
    },
    '/reports': { $ref: '#/x-path-templates/Reports%20v2' },
    '/files': { $ref: '#/x-path-templates/~1files~1{fileId}' },
    '/archive': { $ref: './paths/archive.yaml' },
    '/ghost': { $ref: '#/x-path-templates/Missing' },
    '/loop': { $ref: '#/x-path-templates/Loop' },
    '/transfers': {
      post: {
        operationId: 'createTransfer',
        parameters: { $ref: '#/x-parameter-lists/transfer' },
        responses: ok,
        callbacks: {
          onTransfer: { $ref: '#/components/callbacks/TransferEvent' },
          onStatus: { '{$request.body#/statusUrl}': { $ref: '#/x-path-templates/StatusCallback' } },
          onLoop: { $ref: '#/components/callbacks/Loop' },
          onMissing: { $ref: '#/components/callbacks/Missing' },
        },
      },
    },
    '/transfers/bulk': {
      post: {
        operationId: 'createBulkTransfer',
        parameters: [
          { $ref: '#/components/parameters/pageParam' },
          { $ref: '#/components/parameters/loopParam' },
          { $ref: '#/components/parameters/missingParam' },
          { $ref: '#/components/parameters/chainStartParam' },
          { $ref: '#/components/parameters/batchSize%20Param' },
          { $ref: '#/components/parameters/batch~1modeParam' },
        ],
        responses: ok,
        callbacks: { onTransfer: { $ref: '#/components/callbacks/TransferEvent' } },
      },
    },
  },
  'x-path-templates': {
    Accounts: {
      get: {
        operationId: 'listAccounts',
        parameters: [{ $ref: '#/components/parameters/accountTypeParam' }, { $ref: '#/components/parameters/limitParam' }],
        responses: ok,
      },
    },
    LegacyAccounts: { $ref: '#/x-path-templates/Accounts' },
    Statements: { get: { operationId: 'listStatements', parameters: [{ $ref: '#/components/parameters/statementFormatParam' }], responses: ok } },
    'Reports v2': { get: { operationId: 'listReports', parameters: [{ $ref: '#/components/parameters/reportTypeParam' }], responses: ok } },
    '/files/{fileId}': { parameters: [{ $ref: '#/components/parameters/fileIdParam' }], get: { operationId: 'getFile', responses: ok } },
    StatusCallback: { post: { operationId: 'statusCallback', parameters: [{ $ref: '#/components/parameters/statusSignatureParam' }], responses: ok } },
    Loop: { $ref: '#/x-path-templates/Loop' },
    Unused: { get: { operationId: 'unused', parameters: [{ $ref: '#/components/parameters/unusedRef' }], responses: ok } },
  },
  'x-parameter-lists': {
    transfer: [{ $ref: '#/components/parameters/transferModeParam' }, { $ref: '#/components/parameters/limitParam' }],
  },
  components: {
    parameters: {
      limitParam: { name: 'limit', in: 'query', schema: { type: 'integer' } },
      accountTypeParam: { name: 'accountType', in: 'query', schema: { type: 'string' } },
      statementPeriodParam: { name: 'period', in: 'query', schema: { type: 'string' } },
      channelHeaderParam: { name: 'X-Channel', in: 'header', schema: { type: 'string' } },
      statementFormatParam: { name: 'format', in: 'query', schema: { type: 'string' } },
      reportTypeParam: { name: 'type', in: 'query', schema: { type: 'string' } },
      fileIdParam: { name: 'fileId', in: 'path', required: true, schema: { type: 'string' } },
      statusSignatureParam: { name: 'X-Status-Signature', in: 'header', schema: { type: 'string' } },
      transferModeParam: { name: 'mode', in: 'query', schema: { type: 'string' } },
      eventSignatureParam: { name: 'X-Event-Signature', in: 'header', schema: { type: 'string' } },
      pageParam: { $ref: '#/components/parameters/pageSizeParam' },
      pageSizeParam: { name: 'pageSize', in: 'query', schema: { type: 'integer' } },
      loopParam: { $ref: '#/components/parameters/loopParam' },
      chainStartParam: { $ref: '#/components/parameters/chainMiddleParam' },
      chainMiddleParam: { $ref: '#/components/parameters/chainEndParam' },
      chainEndParam: { name: 'chain', in: 'query', schema: { type: 'string' } },
      'batchSize Param': { name: 'batchSize', in: 'query', schema: { type: 'integer' } },
      'batch/modeParam': { $ref: '#/components/parameters/batchModeParam' },
      batchModeParam: { name: 'batchMode', in: 'query', schema: { type: 'string' } },
    },
    callbacks: {
      TransferEvent: {
        '{$request.body#/callbackUrl}': {
          post: { operationId: 'transferEvent', parameters: [{ $ref: '#/components/parameters/eventSignatureParam' }], responses: ok },
        },
      },
      Loop: { $ref: '#/components/callbacks/Loop' },
    },
  },
};
