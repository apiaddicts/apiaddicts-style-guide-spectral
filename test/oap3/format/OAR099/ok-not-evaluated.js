const envelope = (data) => ({
  type: 'object',
  properties: {
    data,
    detail: { $ref: '#/components/schemas/Detail' },
  },
});

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'API Product Scoring',
    version: '1.0.0',
    description: 'Scores and metrics of the APIs of an organization.',
  },
  servers: [{ url: 'https://api-gw.apiquality.io/api-product-scoring/v1' }],
  tags: [
    { name: 'Health' },
    { name: 'Collections' },
    { name: 'APIs' },
    { name: 'Pipelines' },
    { name: 'Metrics' },
  ],
  security: [{ bearerAuth: [], apiKeyAuth: [] }],
  paths: {
    '/status': {
      get: {
        tags: ['Health'],
        operationId: 'get_status',
        summary: 'Check that the backend is up.',
        security: [{ apiKeyAuth: [] }],
        responses: { 200: { description: 'The backend is up' } },
      },
    },
    '/status/database': {
      get: {
        tags: ['Health'],
        operationId: 'get_status_database',
        responses: { 200: { description: 'Database connectivity' } },
      },
    },
    '/status/components/{componentName}': {
      get: {
        tags: ['Health'],
        operationId: 'get_status_component',
        parameters: [{ name: 'componentName', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Component status' } },
      },
    },
    '/collections': {
      get: {
        tags: ['Collections'],
        operationId: 'list_collections',
        responses: {
          200: {
            description: 'Collections of the organization',
            content: { 'application/json': { schema: envelope({ type: 'array', items: { $ref: '#/components/schemas/Collection' } }) } },
          },
        },
      },
    },
    '/collections/{collectionId}/apis': {
      $ref: '#/components/x-path-items/CollectionApis',
    },
    '/apis/{apiId}/branches/{branchId}/pipelines': {
      servers: [{ url: 'https://pipelines.apiquality.io/pipelines/v1' }],
      get: {
        tags: ['Pipelines'],
        operationId: 'list_branch_pipelines',
        servers: [{ url: 'https://runner.apiquality.io/runner' }],
        parameters: [
          { name: 'apiId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'branchId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Pipelines of the branch' } },
      },
    },
    '/metrics/resource-scoring': {
      get: {
        tags: ['Metrics'],
        operationId: 'get_resource_scoring',
        responses: {
          200: {
            description: 'Scoring breakdown',
            links: {
              History: {
                operationId: 'get_status',
                server: { url: 'https://history.apiquality.io/history/v1' },
              },
            },
          },
        },
      },
    },
    '/v1/legacy/api-scores': {
      get: {
        tags: ['Metrics'],
        operationId: 'get_legacy_scores',
        deprecated: true,
        responses: { 200: { description: 'Legacy scores' } },
      },
    },
  },
  'x-servers': [{ url: 'https://gateway.apiquality.io/product-scoring/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' },
      apiKeyAuth: { type: 'apiKey', in: 'header', name: 'apikey' },
    },
    'x-path-items': {
      CollectionApis: {
        get: {
          tags: ['APIs'],
          operationId: 'list_collection_apis',
          parameters: [{ name: 'collectionId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'APIs of the collection' } },
        },
      },
    },
    schemas: {
      Detail: {
        type: 'object',
        properties: { code: { type: 'string' }, message: { type: 'string' } },
      },
      Collection: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          gatewayUrl: { type: 'string', example: 'https://gateway.apiquality.io/collections/v1' },
        },
      },
    },
  },
};
