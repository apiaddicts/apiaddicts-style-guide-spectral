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
        { $ref: '#/parameters/tenantHeaderParam' },
        { $ref: '#/parameters/correlationIdParam' },
      ],
      get: {
        operationId: 'listPets',
        parameters: [
          { $ref: '#/parameters/startParam' },
          { $ref: '#/parameters/limitParam' },
          { $ref: '#/parameters/totalParam' },
          { $ref: '#/parameters/speciesFilterParam' },
          { name: 'q', in: 'query', type: 'string' },
        ],
        responses: ok,
      },
      post: {
        operationId: 'createPet',
        parameters: [
          { name: 'body', in: 'body', schema: { $ref: '#/definitions/Pet' } },
          { $ref: '#/parameters/requestIdParam' },
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
      parameters: [{ $ref: '#/parameters/petIdParam' }],
      get: { operationId: 'getPet', parameters: [{ $ref: 'common.yaml#/parameters/localeParam' }], responses: ok },
      put: { operationId: 'replacePet', parameters: [{ $ref: 'https://schemas.vetclinic.example.com/common.yaml#/parameters/ifMatchParam' }], responses: ok },
      patch: { operationId: 'updatePet', parameters: [{ $ref: '#/parameters/ifMatchParam', description: 'Ignored sibling.' }], responses: ok },
      delete: { operationId: 'deletePet', parameters: [{ $ref: '#/parameters/reasonParam' }], responses: ok },
      head: { operationId: 'checkPet', parameters: [{ $ref: '#/parameters/etagParam' }], responses: ok },
      options: { operationId: 'petOptions', parameters: [{ $ref: '#/parameters/originParam' }], responses: ok },
    },
    '/owners': {
      get: {
        operationId: 'listOwners',
        parameters: [{ $ref: '#/parameters/limitParam' }, { name: 'ownerName', in: 'query', type: 'string' }],
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
    '/health': { get: { operationId: 'health', responses: ok } },
    'x-shared': { get: { parameters: [{ $ref: '#/parameters/sharedOnly' }] } },
  },
  parameters: {
    tenantHeaderParam: { name: 'X-Tenant-Id', in: 'header', type: 'string', required: true },
    correlationIdParam: { name: 'X-Correlation-Id', in: 'header', type: 'string' },
    startParam: { name: '$start', in: 'query', type: 'integer' },
    limitParam: { name: '$limit', in: 'query', type: 'integer' },
    totalParam: { name: '$total', in: 'query', type: 'boolean' },
    speciesFilterParam: { name: 'species', in: 'query', type: 'string' },
    requestIdParam: { name: 'X-Request-Id', in: 'header', type: 'string' },
    petIdParam: { name: 'petId', in: 'path', type: 'string', required: true },
    ifMatchParam: { name: 'If-Match', in: 'header', type: 'string' },
    reasonParam: { name: 'reason', in: 'query', type: 'string' },
    etagParam: { name: 'If-None-Match', in: 'header', type: 'string' },
    originParam: { name: 'Origin', in: 'header', type: 'string' },
    pageSizeParam: { $ref: '#/parameters/limitParam' },
    Param: { name: 'param', in: 'query', type: 'string' },
    aliasParam: { $ref: '#/parameters/Param' },
  },
  definitions: {
    Pet: { type: 'object', properties: { name: { type: 'string' } } },
    SearchFilter: { type: 'object', properties: { field: { type: 'string' } } },
  },
};
