module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  paths: {
    '/customers': {
      parameters: [
        {
          $ref: '#/parameters/regionParam',
        },
      ],
      get: {
        parameters: [
          {
            $ref: '#/parameters/onboardingStatusParam',
          },
          {
            $ref: '#/parameters/pageSizeParam',
          },
          {
            $ref: '#/parameters/customerIdPath',
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
    regionParam: {
      in: 'query',
      name: 'Region2',
      type: 'string',
    },
    onboardingStatusParam: {
      in: 'query',
      name: 'onboarding_status1',
      type: 'string',
    },
    pageSizeParam: {
      in: 'query',
      name: 'pageSize2',
      type: 'integer',
    },
    customerIdPath: {
      in: 'path',
      name: 'CustomerId2',
      required: true,
      type: 'string',
    },
    unusedParam: {
      in: 'query',
      name: 'UnusedParam',
      type: 'string',
    },
  },
};
