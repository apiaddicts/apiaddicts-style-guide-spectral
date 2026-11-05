module.exports = {
  openapi: '3.0.3',
  info: { title: 'Card Payments API', version: '4.2.0', description: 'Authorisations, captures and refunds.' },
  servers: [{ url: 'https://api.payments.example.com/v4' }],
  tags: [{ name: 'payments' }, { name: 'refunds' }],
  paths: {
    '/payments': {
      get: {
        tags: ['payments'],
        operationId: 'listPayments',
        responses: {
          200: { description: 'Payments', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } } } } },
          400: {
            description: 'Invalid filter',
            content: {
              'application/problem+json': {
                schema: { type: 'object', properties: { type: { type: 'string' }, title: { type: 'string' }, stackTrace: { type: 'string' } } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          '5XX': {
            description: 'Upstream failure',
            content: { 'application/json': { schema: { type: 'object', properties: { STACKTRACE: { type: 'string' } } } } },
          },
        },
      },
      post: {
        tags: ['payments'],
        operationId: 'createPayment',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PaymentRequest' } } } },
        responses: {
          202: {
            description: 'Accepted for asynchronous processing',
            content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' }, stackTrace: { type: 'string', nullable: true } } } } },
          },
          403: { $ref: '#/components/responses/Unauthorized' },
          409: {
            description: 'Duplicate payment',
            content: {
              'application/xml': {
                schema: { type: 'object', xml: { name: 'error' }, properties: { reason: { type: 'string' }, StackTrace: { type: 'string', xml: { attribute: true } } } },
              },
            },
          },
          422: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/ValidationError' },
                    { $ref: '#/components/schemas/Problem' },
                  ],
                  discriminator: { propertyName: 'kind' },
                },
              },
            },
          },
          429: {
            description: 'Rate limited',
            content: {
              'application/json': {
                schema: {
                  anyOf: [
                    { type: 'object', properties: { retryAfter: { type: 'integer' } } },
                    { type: 'object', properties: { exceptionStackTrace: { type: 'string' } } },
                  ],
                },
              },
            },
          },
          default: {
            description: 'Unexpected error',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/Problem' },
                    { type: 'object', properties: { debug: { type: 'object', properties: { 'Stack Trace': { type: 'string' } } } } },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/payments/{paymentId}': {
      parameters: [{ name: 'paymentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      get: {
        tags: ['payments'],
        operationId: 'getPayment',
        responses: {
          200: { description: 'Payment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Payment' } } } },
          404: { description: 'Payment not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Problem' } } } },
        },
      },
      trace: {
        tags: ['payments'],
        operationId: 'tracePayment',
        responses: {
          500: { description: 'Trace failed', content: { 'message/http': { schema: { type: 'object', properties: { stacktrace: { type: 'string' } } } } } },
        },
      },
      delete: {
        tags: ['payments'],
        operationId: 'voidPayment',
        responses: {
          204: { description: 'Voided' },
          503: {
            description: 'Acquirer unavailable',
            content: { 'application/json': { schema: { type: 'object', properties: { acquirer: { type: 'string' }, stack_trace: null } } } },
          },
        },
      },
    },
  },
  components: {
    responses: {
      Unauthorized: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Problem' } } } },
    },
    schemas: {
      Payment: { type: 'object', properties: { id: { type: 'string' }, amount: { type: 'integer' }, currency: { type: 'string' } } },
      PaymentRequest: { type: 'object', properties: { amount: { type: 'integer' }, stackTrace: { type: 'string' } } },
      Problem: {
        type: 'object',
        description: 'Standard error response format for all API errors.',
        required: ['timestamp', 'path', 'errors'],
        properties: {
          kind: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          path: { type: 'string' },
          errors: { type: 'array', items: { type: 'string' } },
          stack_trace: { type: 'string', format: 'date-time', example: '2026-10-29T08:36:00Z' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          errors: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, 'stack-trace': { type: 'string' } } } },
        },
      },
    },
  },
};
