const ok = { 200: { description: 'Ok' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Lab Results API', version: '1.2.0' },
  host: 'api.labs.example.com',
  basePath: '/lab/v1',
  paths: {
    '/results': { $ref: '#/x-path-templates/Results' },
    '/v1/results': { $ref: '#/x-path-templates/Results' },
    '/legacy/results': { $ref: '#/x-path-templates/LegacyResults' },
    '/samples': {
      $ref: '#/x-path-templates/Samples',
      post: { operationId: 'createSample', parameters: [{ $ref: '#/parameters/labIdParam' }], responses: ok },
    },
    '/reports': { $ref: '#/x-path-templates/Reports%20v2' },
    '/files': { $ref: '#/x-path-templates/~1files~1{fileId}' },
    '/archive': { $ref: './paths/archive.yaml' },
    '/ghost': { $ref: '#/x-path-templates/Missing' },
    '/loop': { $ref: '#/x-path-templates/Loop' },
    '/panels': {
      get: {
        operationId: 'listPanels',
        parameters: [
          { $ref: '#/x-shared-params/pageParam' },
          { $ref: '#/parameters/loopParam' },
          { $ref: '#/parameters/missingParam' },
          { $ref: '#/parameters/chainStartParam' },
        ],
        responses: ok,
      },
      put: { operationId: 'replacePanels', parameters: { $ref: '#/x-parameter-lists/bulk' }, responses: ok },
    },
  },
  'x-path-templates': {
    Results: {
      get: {
        operationId: 'listResults',
        parameters: [{ $ref: '#/parameters/patientIdParam' }, { $ref: '#/parameters/limitParam' }],
        responses: ok,
      },
    },
    LegacyResults: { $ref: '#/x-path-templates/Results' },
    Samples: { get: { operationId: 'listSamples', parameters: [{ $ref: '#/parameters/sampleTypeParam' }], responses: ok } },
    'Reports v2': { get: { operationId: 'listReports', parameters: [{ $ref: '#/parameters/reportFormatParam' }], responses: ok } },
    '/files/{fileId}': { parameters: [{ $ref: '#/parameters/fileIdParam' }], get: { operationId: 'getFile', responses: ok } },
    Loop: { $ref: '#/x-path-templates/Loop' },
    Unused: { get: { operationId: 'unused', parameters: [{ $ref: '#/parameters/unusedRef' }], responses: ok } },
  },
  'x-shared-params': {
    pageParam: { $ref: '#/x-shared-params/pageSizeParam' },
    pageSizeParam: { name: 'pageSize', in: 'query', type: 'integer' },
  },
  'x-parameter-lists': {
    bulk: [{ $ref: '#/parameters/bulkModeParam' }, { $ref: '#/parameters/limitParam' }],
  },
  parameters: {
    limitParam: { name: 'limit', in: 'query', type: 'integer' },
    patientIdParam: { name: 'patientId', in: 'query', type: 'string' },
    sampleTypeParam: { name: 'sampleType', in: 'query', type: 'string' },
    reportFormatParam: { name: 'format', in: 'query', type: 'string' },
    fileIdParam: { name: 'fileId', in: 'path', type: 'string', required: true },
    labIdParam: { name: 'X-Lab-Id', in: 'header', type: 'string' },
    bulkModeParam: { name: 'mode', in: 'query', type: 'string' },
    loopParam: { $ref: '#/parameters/loopParam' },
    chainStartParam: { $ref: '#/parameters/chainMiddleParam' },
    chainMiddleParam: { $ref: '#/parameters/chainEndParam' },
    chainEndParam: { name: 'chain', in: 'query', type: 'string' },
  },
};
