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
      parameters: [{ $ref: '#/components/parameters/statementPeriod' }],
      post: { operationId: 'requestStatement', parameters: [{ $ref: '#/components/parameters/channelHeader' }], responses: ok },
    },
    '/reports': { $ref: '#/x-path-templates/Reports%20v2' },
    '/files': { $ref: '#/x-path-templates/~1files~1{fileId}' },
    '/ghost': { $ref: '#/x-path-templates/Missing' },
    '/transfers': {
      post: {
        operationId: 'createTransfer',
        parameters: { $ref: '#/x-parameter-lists/transfer' },
        responses: ok,
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
        parameters: [
          { $ref: '#/components/parameters/pageParam' },
          { $ref: '#/components/parameters/loop' },
          { $ref: '#/components/parameters/missing' },
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
        parameters: [{ $ref: '#/components/parameters/accountType' }, { $ref: '#/components/parameters/limitParam' }],
        responses: ok,
      },
    },
    LegacyAccounts: { $ref: '#/x-path-templates/Accounts' },
    Statements: { get: { operationId: 'listStatements', parameters: [{ $ref: '#/components/parameters/statementFormat' }], responses: ok } },
    'Reports v2': { get: { operationId: 'listReports', parameters: [{ $ref: '#/components/parameters/reportType' }], responses: ok } },
    '/files/{fileId}': { parameters: [{ $ref: '#/components/parameters/fileId' }], get: { operationId: 'getFile', responses: ok } },
    StatusCallback: { post: { operationId: 'statusCallback', parameters: [{ $ref: '#/components/parameters/statusSignature' }], responses: ok } },
    Unused: { get: { operationId: 'unused', parameters: [{ $ref: '#/components/parameters/unusedRef' }], responses: ok } },
  },
  'x-parameter-lists': {
    transfer: [{ $ref: '#/components/parameters/transferMode' }, { $ref: '#/components/parameters/limitParam' }],
  },
  components: {
    parameters: {
      limitParam: { name: 'limit', in: 'query', schema: { type: 'integer' } },
      accountType: { name: 'accountType', in: 'query', schema: { type: 'string' } },
      statementPeriod: { name: 'period', in: 'query', schema: { type: 'string' } },
      channelHeader: { name: 'X-Channel', in: 'header', schema: { type: 'string' } },
      statementFormat: { name: 'format', in: 'query', schema: { type: 'string' } },
      reportType: { name: 'type', in: 'query', schema: { type: 'string' } },
      fileId: { name: 'fileId', in: 'path', required: true, schema: { type: 'string' } },
      statusSignature: { name: 'X-Status-Signature', in: 'header', schema: { type: 'string' } },
      transferMode: { name: 'mode', in: 'query', schema: { type: 'string' } },
      eventSignature: { name: 'X-Event-Signature', in: 'header', schema: { type: 'string' } },
      pageParam: { $ref: '#/components/parameters/pageSize' },
      pageSize: { name: 'pageSize', in: 'query', schema: { type: 'integer' } },
      loop: { $ref: '#/components/parameters/loop' },
      chainStartParam: { $ref: '#/components/parameters/chainMiddle' },
      chainMiddle: { $ref: '#/components/parameters/chainEndParam' },
      chainEndParam: { name: 'chain', in: 'query', schema: { type: 'string' } },
      'batchSize Param': { name: 'batchSize', in: 'query', schema: { type: 'integer' } },
      'batch/modeParam': { $ref: '#/components/parameters/batchMode' },
      batchMode: { name: 'batchMode', in: 'query', schema: { type: 'string' } },
    },
    callbacks: {
      TransferEvent: {
        '{$request.body#/callbackUrl}': {
          post: { operationId: 'transferEvent', parameters: [{ $ref: '#/components/parameters/eventSignature' }], responses: ok },
        },
      },
      Loop: { $ref: '#/components/callbacks/Loop' },
    },
  },
};
