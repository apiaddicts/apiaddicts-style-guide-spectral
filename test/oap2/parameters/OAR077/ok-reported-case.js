module.exports = {
  swagger: '2.0',
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
            $ref: '#/parameters/onboardingStatusParam',
          },
          {
            $ref: '#/parameters/withoutTotal',
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
    },
    '/customers/{customerId}/accounts': {
      parameters: [
        {
          $ref: '#/parameters/onboardingStatusParam',
        },
      ],
      get: {
        operationId: 'listCustomerAccounts',
        parameters: [
          {
            in: 'path',
            name: 'customerId',
            required: true,
            type: 'string',
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
  parameters: {
    withoutTotal: {
      in: 'query',
      name: 'without_total',
      required: false,
      type: 'boolean',
      default: false,
    },
    onboardingStatusParam: {
      in: 'query',
      name: 'onboarding_status1',
      required: false,
      description: 'Filter customers by onboarding status.',
      type: 'string',
      enum: ['pending', 'completed'],
    },
  },
};
