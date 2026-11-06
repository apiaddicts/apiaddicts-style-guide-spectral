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
      post: { operationId: 'createSample', parameters: [{ $ref: '#/parameters/labId' }], responses: ok },
    },
    '/reports': { $ref: '#/x-path-templates/Reports%20v2' },
    '/files': { $ref: '#/x-path-templates/~1files~1{fileId}' },
    '/ghost': { $ref: '#/x-path-templates/Missing' },
    '/panels': {
      get: {
        operationId: 'listPanels',
        parameters: [
          { $ref: '#/x-shared-params/pageParam' },
          { $ref: '#/parameters/loop' },
          { $ref: '#/parameters/missing' },
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
        parameters: [{ $ref: '#/parameters/patientId' }, { $ref: '#/parameters/limitParam' }],
        responses: ok,
      },
    },
    LegacyResults: { $ref: '#/x-path-templates/Results' },
    Samples: { get: { operationId: 'listSamples', parameters: [{ $ref: '#/parameters/sampleType' }], responses: ok } },
    'Reports v2': { get: { operationId: 'listReports', parameters: [{ $ref: '#/parameters/reportFormat' }], responses: ok } },
    '/files/{fileId}': { parameters: [{ $ref: '#/parameters/fileId' }], get: { operationId: 'getFile', responses: ok } },
    Unused: { get: { operationId: 'unused', parameters: [{ $ref: '#/parameters/unusedRef' }], responses: ok } },
  },
  'x-shared-params': {
    pageParam: { $ref: '#/x-shared-params/pageSize' },
    pageSize: { name: 'pageSize', in: 'query', type: 'integer' },
  },
  'x-parameter-lists': {
    bulk: [{ $ref: '#/parameters/bulkMode' }, { $ref: '#/parameters/limitParam' }],
  },
  parameters: {
    limitParam: { name: 'limit', in: 'query', type: 'integer' },
    patientId: { name: 'patientId', in: 'query', type: 'string' },
    sampleType: { name: 'sampleType', in: 'query', type: 'string' },
    reportFormat: { name: 'format', in: 'query', type: 'string' },
    fileId: { name: 'fileId', in: 'path', type: 'string', required: true },
    labId: { name: 'X-Lab-Id', in: 'header', type: 'string' },
    bulkMode: { name: 'mode', in: 'query', type: 'string' },
    loop: { $ref: '#/parameters/loop' },
    chainStartParam: { $ref: '#/parameters/chainMiddle' },
    chainMiddle: { $ref: '#/parameters/chainEndParam' },
    chainEndParam: { name: 'chain', in: 'query', type: 'string' },
  },
};
