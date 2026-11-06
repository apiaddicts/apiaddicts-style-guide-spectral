module.exports = {
  openapi: '3.0.3',
  info: { title: 'Marketplace Catalog API', version: '5.0.0' },
  servers: [{ url: 'https://api.marketplace.example.com/catalog' }],
  paths: {
    '/products': {
      get: {
        operationId: 'listProducts',
        responses: {
          200: { description: 'Products', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/categories': {
      get: {
        operationId: 'listCategories',
        responses: {
          200: { description: 'Category tree', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          409: { description: 'Inconsistent tree', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          410: { description: 'Category retired', content: { 'application/json': { schema: { $ref: '#/components/schemas/Envelope/properties/error' } } } },
        },
      },
    },
    '/products/{productId}/reviews': { $ref: '#/x-path-items/Reviews' },
  },
  'x-path-items': {
    Reviews: {
      parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        operationId: 'listReviews',
        responses: {
          200: { description: 'Reviews', content: { 'application/json': { schema: { type: 'array', items: { type: 'string' } } } } },
          500: { description: 'Search index failure', content: { 'application/json': { schema: { type: 'object', properties: { indexStackTrace: { type: 'string' } } } } } },
        },
      },
    },
  },
  components: {
    responses: {
      BadRequest: { $ref: '#/components/responses/BadRequestBase' },
      BadRequestBase: { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Problem' } } } },
    },
    schemas: {
      Product: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
      Problem: { allOf: [{ $ref: '#/components/schemas/ProblemBase' }, { type: 'object', properties: { instance: { type: 'string' } } }] },
      ProblemBase: { type: 'object', properties: { status: { type: 'integer' }, stackTrace: { type: 'string' } } },
      Category: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          children: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
          stack_trace: { type: 'string' },
        },
      },
      Envelope: {
        type: 'object',
        properties: {
          data: { type: 'object' },
          error: { type: 'object', properties: { code: { type: 'string' }, 'STACK-TRACE': { type: 'string' } } },
        },
      },
    },
  },
};
