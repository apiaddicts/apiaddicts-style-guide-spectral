const errorResponse = { $ref: '#/components/responses/internalServerErrorResponse' };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Slate Onboarding API', version: '1.0.0' },
  servers: [
    { url: 'https://api-dev.slate.com/onboarding/v1', description: 'Development server.' },
    { url: 'https://api-pre.slate.com/onboarding/v1', description: 'Pre-production server.' },
    { url: 'https://api.slate.com/onboarding/v1', description: 'Production server.' },
  ],
  tags: [{ name: 'customers' }, { name: 'monitoring' }],
  security: [{ apiKeyAuth: [] }],
  paths: {
    '/customers': {
      get: { security: [{ apiKeyAuth: [] }], tags: ['customers'], summary: 'List customers', responses: { 200: { description: 'Ok' }, 500: errorResponse } },
      post: { tags: ['customers'], summary: 'Create customer', responses: { 201: { description: 'Created' }, 500: errorResponse } },
    },
    '/customers/{customerId}': {
      parameters: [{ $ref: '#/components/parameters/customerIdParam' }],
      get: { security: [{ apiKeyAuth: [] }], tags: ['customers'], summary: 'Get customer', responses: { 200: { description: 'Ok' }, 500: errorResponse } },
      delete: { security: [{ apiKeyAuth: [] }], tags: ['customers'], summary: 'Delete customer', responses: { 204: { description: 'Deleted' }, 500: errorResponse } },
    },
  },
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key required for authentication and authorization to access the API.',
      },
    },
    parameters: { customerIdParam: { name: 'customerId', in: 'path', required: true, schema: { type: 'string' } } },
    responses: { internalServerErrorResponse: { description: 'Unexpected error.' } },
  },
};
