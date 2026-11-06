const ok = { 200: { description: 'Ok' } };

module.exports = {
  swagger: '2.0',
  info: { title: 'Veterinary Clinic API', version: '3.4.0' },
  host: 'api.vetclinic.example.com',
  basePath: '/clinic/v3',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/pets': {
      parameters: [
        { $ref: '#/parameters/tenantHeader' },
        { $ref: '#/parameters/correlationIdParam' },
      ],
      get: {
        operationId: 'listPets',
        parameters: [
          { $ref: '#/parameters/startSlate' },
          { $ref: '#/parameters/limitParam' },
          { $ref: '#/parameters/totalParam' },
          { $ref: '#/parameters/speciesFilter' },
          { name: 'q', in: 'query', type: 'string' },
        ],
        responses: ok,
      },
      post: {
        operationId: 'createPet',
        parameters: [
          { name: 'body', in: 'body', schema: { $ref: '#/definitions/Pet' } },
          { $ref: '#/parameters/requestIdparam' },
        ],
        responses: ok,
      },
      trace: {
        operationId: 'tracePets',
        parameters: [{ $ref: '#/parameters/traceOnly' }],
        responses: ok,
      },
      'x-internal': { parameters: [{ $ref: '#/parameters/internalOnly' }] },
    },
    '/pets/{petId}': {
      parameters: [{ $ref: '#/parameters/petId' }],
      get: { operationId: 'getPet', parameters: [{ $ref: 'common.yaml#/parameters/localeParam' }], responses: ok },
      put: { operationId: 'replacePet', parameters: [{ $ref: 'common.yaml#/parameters/ifMatch' }], responses: ok },
      patch: { operationId: 'updatePet', parameters: [{ $ref: './parameters/ifMatchParam.yaml' }], responses: ok },
      delete: { operationId: 'deletePet', parameters: [{ $ref: '#/parameters/reasonParameter' }], responses: ok },
      head: { operationId: 'checkPet', parameters: [{ $ref: '#/parameters/etag' }], responses: ok },
      options: { operationId: 'petOptions', parameters: [{ $ref: '#/parameters/originParam' }], responses: ok },
    },
    '/owners': {
      get: {
        operationId: 'listOwners',
        parameters: [{ $ref: '#/parameters/limitParam' }, { $ref: '#/parameters/ownerNameParam' }],
        responses: {
          200: {
            description: 'Owners',
            schema: {
              type: 'object',
              properties: {
                parameters: { type: 'array', items: { $ref: '#/definitions/SearchFilter' } },
                links: { type: 'object', properties: { parameters: { $ref: '#/definitions/SearchFilter' } } },
              },
            },
          },
        },
      },
    },
    'x-shared': { get: { parameters: [{ $ref: '#/parameters/sharedOnly' }] } },
  },
  parameters: {
    tenantHeader: { name: 'X-Tenant-Id', in: 'header', type: 'string', required: true },
    correlationIdParam: { name: 'X-Correlation-Id', in: 'header', type: 'string' },
    startSlate: { name: '$start', in: 'query', type: 'integer' },
    limitParam: { name: '$limit', in: 'query', type: 'integer' },
    totalParam: { name: '$total', in: 'query', type: 'boolean' },
    speciesFilter: { name: 'species', in: 'query', type: 'string' },
    requestIdparam: { name: 'X-Request-Id', in: 'header', type: 'string' },
    petId: { name: 'petId', in: 'path', type: 'string', required: true },
    reasonParameter: { name: 'reason', in: 'query', type: 'string' },
    etag: { name: 'If-None-Match', in: 'header', type: 'string' },
    originParam: { name: 'Origin', in: 'header', type: 'string' },
    ownerNameParam: { name: 'ownerName', in: 'query', type: 'string' },
    pageSizeParam: { $ref: '#/parameters/limitParam' },
    pageAlias: { $ref: '#/parameters/pageSize' },
    pageSize: { name: 'pageSize', in: 'query', type: 'integer' },
  },
  definitions: {
    Pet: { type: 'object', properties: { name: { type: 'string' } } },
    SearchFilter: { type: 'object', properties: { field: { type: 'string' } } },
  },
};
