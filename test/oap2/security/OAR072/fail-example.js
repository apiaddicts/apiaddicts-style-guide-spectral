module.exports = {
  swagger: '2.0',
  info: { title: 'Insurance Claims API', version: '3.4.0', description: 'Claims intake and settlement for brokers.' },
  host: 'api.claims.example.com',
  basePath: '/v3',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [{ name: 'claims' }, { name: 'documents' }],
  paths: {
    '/claims': {
      get: {
        tags: ['claims'],
        operationId: 'listClaims',
        parameters: [
          { name: 'status', in: 'query', type: 'string', enum: ['open', 'settled', 'rejected'] },
          { name: '$limit', in: 'query', type: 'integer', minimum: 1, maximum: 100 },
        ],
        responses: {
          200: { description: 'Claims found', schema: { type: 'array', items: { $ref: '#/definitions/Claim' } } },
          400: {
            description: 'Invalid filter',
            schema: {
              type: 'object',
              properties: {
                code: { type: 'integer', format: 'int32' },
                message: { type: 'string' },
                details: { type: 'string' },
                stackTrace: { type: 'string' },
              },
            },
          },
          500: { $ref: '#/responses/ServerError' },
        },
      },
      post: {
        tags: ['claims'],
        operationId: 'createClaim',
        parameters: [{ name: 'body', in: 'body', required: true, schema: { $ref: '#/definitions/ClaimDraft' } }],
        responses: {
          201: {
            description: 'Claim created',
            schema: { type: 'object', properties: { id: { type: 'string' }, stacktrace: { type: 'string' } } },
          },
          409: { description: 'Duplicate claim', schema: { $ref: '#/definitions/ErrorResponse' } },
          422: {
            description: 'Validation failed',
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    details: {
                      type: 'array',
                      items: { type: 'object', properties: { field: { type: 'string' }, 'stack-trace': { type: 'string' } } },
                    },
                  },
                },
              },
            },
          },
          default: {
            description: 'Unexpected error',
            schema: {
              allOf: [
                { $ref: '#/definitions/ErrorBase' },
                { type: 'object', properties: { STACK_TRACE: { type: 'string' } } },
              ],
            },
          },
        },
      },
    },
    '/claims/{claimId}': {
      parameters: [{ name: 'claimId', in: 'path', required: true, type: 'string' }],
      get: {
        tags: ['claims'],
        operationId: 'getClaim',
        responses: {
          200: { description: 'Claim found', schema: { $ref: '#/definitions/Claim' } },
          404: { description: 'Claim not found', schema: { $ref: '#/definitions/ErrorResponse' } },
        },
      },
      head: {
        tags: ['claims'],
        operationId: 'checkClaim',
        responses: {
          200: { description: 'Claim exists' },
          404: { description: 'Claim not found', schema: { type: 'object', properties: { Stack_Trace: { type: 'string' } } } },
        },
      },
      options: {
        tags: ['claims'],
        operationId: 'claimOptions',
        responses: {
          204: { description: 'Allowed methods' },
          405: {
            description: 'Method not allowed',
            schema: { type: 'object', additionalProperties: { type: 'object', properties: { StackTrace: { type: 'string' } } } },
          },
        },
      },
      delete: {
        tags: ['claims'],
        operationId: 'withdrawClaim',
        responses: {
          204: { description: 'Claim withdrawn' },
          503: { description: 'Settlement engine under maintenance', schema: { $ref: '#/definitions/MaintenanceError' } },
        },
      },
    },
  },
  responses: {
    ServerError: {
      description: 'Server error',
      schema: { type: 'object', properties: { message: { type: 'string' }, exceptionStackTrace: { type: 'string' } } },
    },
  },
  definitions: {
    Claim: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
        amount: { type: 'number', format: 'double' },
      },
    },
    ClaimDraft: { type: 'object', properties: { policyId: { type: 'string' }, amount: { type: 'number' } } },
    ErrorBase: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } },
    ErrorResponse: {
      type: 'object',
      description: 'Standard error response format for all API errors.',
      required: ['timestamp', 'path', 'errors'],
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string' },
        errors: { type: 'array', items: { type: 'string' } },
        stack_trace: { type: 'string', format: 'date-time', example: '2026-10-29T08:36:00Z' },
      },
    },
    MaintenanceError: {
      type: 'object',
      properties: { retryAfter: { type: 'integer' }, 'stack.trace': { type: 'string' } },
    },
  },
};
