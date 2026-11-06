module.exports = {
  swagger: '2.0',
  info: { title: 'Slate Onboarding API', version: '1.0.0' },
  host: 'api.slate.com',
  basePath: '/onboarding/v1',
  schemes: ['https'],
  tags: [{ name: 'customers' }, { name: 'monitoring' }],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
      description: 'API key required for authentication and authorization to access the API.',
    },
  },
  security: [{ apiKeyAuth: [] }],
  paths: {
    '/customers': {
      get: { security: [{ apiKeyAuth: [] }], tags: ['customers'], summary: 'List customers', responses: { 200: { description: 'Ok' } } },
      post: { tags: ['customers'], summary: 'Create customer', responses: { 201: { description: 'Created' } } },
    },
    '/customers/{customerId}': {
      get: { security: [{ apiKeyAuth: [] }], tags: ['customers'], summary: 'Get customer', responses: { 200: { description: 'Ok' } } },
      delete: { security: [{ apiKeyAuth: [] }], tags: ['customers'], summary: 'Delete customer', responses: { 204: { description: 'Deleted' } } },
    },
  },
};
