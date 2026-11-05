module.exports = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  paths: {
    '/customers': {
      get: {
        operationId: 'listCustomers',
        parameters: [
          {
            $ref: '#/components/parameters/onboardingStatusParam',
          },
          {
            $ref: '#/components/parameters/withoutTotal',
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
    },
  },
  components: {
    parameters: {
      withoutTotal: {
        in: 'query',
        name: 'without_total',
        required: false,
        schema: {
          type: 'boolean',
        },
        examples: {
          withoutTotal: {
            summary: 'Do not calculate totals - faster',
            value: false,
          },
        },
      },
      onboardingStatusParam: {
        in: 'query',
        name: 'onboarding_status1',
        required: false,
        description: 'Filter customers by onboarding status.',
        schema: {
          $ref: '#/components/schemas/onboardingStatus',
        },
        examples: {
          pending: {
            value: 'pending',
          },
        },
      },
    },
    schemas: {
      onboardingStatus: {
        type: 'string',
        enum: ['pending', 'in_review', 'completed'],
      },
    },
  },
};
