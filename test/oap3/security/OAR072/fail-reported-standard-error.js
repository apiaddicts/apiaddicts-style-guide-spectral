const errorContent = { 'application/json': { schema: { $ref: '#/components/schemas/standardErrorResponse' } } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Customer Onboarding API', version: '1.0.0', description: 'Know your customer checks for new accounts.' },
  servers: [{ url: 'https://api.onboarding.example.com/v1' }],
  paths: {
    '/customers': {
      get: {
        operationId: 'listCustomers',
        responses: {
          200: { description: 'Customers', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/customer' } } } } },
          400: { description: 'Bad request', content: errorContent },
          401: { description: 'Unauthorized', content: errorContent },
          500: { description: 'Internal server error', content: errorContent },
        },
      },
      post: {
        operationId: 'createCustomer',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/customer' } } } },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/customer' } } } },
          400: { description: 'Bad request', content: errorContent },
          409: { description: 'Conflict', content: errorContent },
        },
      },
    },
    '/customers/{customerId}': {
      parameters: [{ name: 'customerId', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        operationId: 'getCustomer',
        responses: {
          200: { description: 'Customer', content: { 'application/json': { schema: { $ref: '#/components/schemas/customer' } } } },
          403: { description: 'Forbidden', content: errorContent },
          404: { description: 'Not found', content: errorContent },
        },
      },
    },
  },
  components: {
    schemas: {
      customer: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
      standardErrorResponse: {
        type: 'object',
        description: 'Standard error response format for all API errors.',
        required: ['timestamp', 'path', 'errors'],
        properties: {
          stack_trace: { type: 'string', format: 'date-time', description: 'Event timestamp as date-time as defined by RFC 3339, section 5.6.', example: '2026-10-29T08:36:00Z' },
          path: { type: 'string' },
          errors: { type: 'array', items: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } } },
        },
      },
    },
  },
};
