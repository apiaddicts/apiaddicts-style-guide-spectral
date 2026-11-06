module.exports = {
  swagger: '2.0',
  info: { title: 'Customer Onboarding API', version: '1.0.0' },
  host: 'api.onboarding.example.com',
  basePath: '/v1',
  schemes: ['https'],
  produces: ['application/json'],
  securityDefinitions: { apiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' } },
  security: [{ apiKeyAuth: [] }],
  paths: {
    '/customers': {
      get: {
        tags: ['customers'],
        summary: 'List customers',
        description: 'Get a paged list of customers. Use the $start, $limit and $total query parameters to navigate through the pages.',
        operationId: 'getCustomers',
        parameters: [
          { $ref: '#/parameters/startSlate' },
          { $ref: '#/parameters/limitParam' },
          { $ref: '#/parameters/totalParam' },
          { $ref: '#/parameters/onboardingStatusParam' },
        ],
        responses: {
          200: { $ref: '#/responses/getCustomersResponse' },
          400: { $ref: '#/responses/badRequestResponse' },
        },
      },
    },
  },
  parameters: {
    startSlate: { name: '$start', in: 'query', type: 'integer', minimum: 1, default: 1 },
    limitParam: { name: '$limit', in: 'query', type: 'integer', minimum: 1, maximum: 100, default: 20 },
    totalParam: { name: '$total', in: 'query', type: 'boolean', default: false },
    onboardingStatusParam: { name: 'onboarding_status', in: 'query', type: 'string', enum: ['pending', 'completed'] },
  },
  responses: {
    getCustomersResponse: { description: 'Customers found.', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object' } } } } },
    badRequestResponse: { description: 'Bad request.' },
  },
};
