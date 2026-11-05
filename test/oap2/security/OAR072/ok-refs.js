module.exports = {
  swagger: '2.0',
  info: { title: 'Loyalty Points API', version: '1.2.0' },
  host: 'api.loyalty.example.com',
  basePath: '/v1',
  schemes: ['https'],
  produces: ['application/json'],
  paths: {
    '/members/{memberId}/balance': {
      parameters: [{ name: 'memberId', in: 'path', required: true, type: 'string' }],
      get: {
        operationId: 'getBalance',
        responses: {
          200: { $ref: '#/responses/BalanceWithDebug' },
          400: { description: 'Dangling error model', schema: { $ref: '#/definitions/DoesNotExist' } },
          404: { description: 'Circular error model', schema: { $ref: '#/definitions/CircularA' } },
          500: { $ref: '#/responses/MissingResponse' },
          409: {
            description: 'Keywords next to $ref are ignored in Swagger 2.0',
            schema: { $ref: '#/definitions/Balance', properties: { stackTrace: { type: 'string' } } },
          },
          503: { description: 'External model that cannot be read', schema: { $ref: './models/missing-errors.yaml#/Error' } },
        },
      },
    },
  },
  responses: {
    BalanceWithDebug: { description: 'Balance', schema: { $ref: '#/definitions/BalanceDebug' } },
    UnusedFailure: { description: 'Never used', schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } },
  },
  definitions: {
    BalanceDebug: { allOf: [{ $ref: '#/definitions/Balance' }, { type: 'object', properties: { stackTrace: { type: 'string' } } }] },
    Balance: { type: 'object', properties: { points: { type: 'integer' } } },
    CircularA: { type: 'object', properties: { next: { $ref: '#/definitions/CircularB' }, message: { type: 'string' } } },
    CircularB: { type: 'object', properties: { previous: { $ref: '#/definitions/CircularA' }, traceId: { type: 'string' } } },
  },
};
