const ref = (name) => ({ $ref: `#/components/${name}` });

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Customer Onboarding API', version: '1.0.0' },
  servers: [{ url: 'https://api.onboarding.example.com/v1' }],
  security: [{ apiKeyAuth: [] }],
  paths: {
    '/customers': {
      get: {
        tags: ['customers'],
        summary: 'List customers',
        description: 'Get a paged list of customers. Results can be filtered by email and onboarding status. Use the $start, $limit and $total query parameters to navigate through the pages.',
        operationId: 'getCustomers',
        parameters: [
          ref('parameters/startSlate'),
          ref('parameters/limitParam'),
          ref('parameters/totalParam'),
          ref('parameters/onboardingStatusParam'),
        ],
        responses: {
          200: ref('responses/getCustomersResponse'),
          400: ref('responses/badRequestResponse'),
        },
      },
    },
  },
  components: {
    securitySchemes: { apiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' } },
    parameters: {
      startSlate: { name: '$start', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
      limitParam: { name: '$limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
      totalParam: { name: '$total', in: 'query', schema: { type: 'boolean', default: false } },
      onboardingStatusParam: { name: 'onboarding_status', in: 'query', schema: { type: 'string', enum: ['pending', 'completed'] } },
    },
    responses: {
      getCustomersResponse: { description: 'Customers found.', content: { 'application/json': { schema: { type: 'object' } } } },
      badRequestResponse: { description: 'Bad request.' },
    },
  },
};
