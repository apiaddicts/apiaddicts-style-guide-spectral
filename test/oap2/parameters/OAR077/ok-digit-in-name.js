module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  basePath: '/onboarding/v1',
  paths: {
    '/customers': {
      parameters: [
        {
          in: 'query',
          name: 'address_line2',
          type: 'string',
        },
      ],
      get: {
        parameters: [
          {
            in: 'query',
            name: 'onboarding_status1',
            type: 'string',
          },
          {
            in: 'query',
            name: 'total_2',
            type: 'integer',
          },
          {
            in: 'query',
            name: 'page_2_size',
            type: 'integer',
          },
          {
            in: 'query',
            name: 'top10',
            type: 'boolean',
          },
          {
            in: 'query',
            name: '$top',
            type: 'integer',
          },
          {
            in: 'query',
            name: '_page2',
            type: 'integer',
          },
          {
            in: 'query',
            name: '$_v2_filter',
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
    '/customers/{customerId}/documents': {
      get: {
        parameters: [
          {
            in: 'path',
            name: 'customerId',
            required: true,
            type: 'string',
          },
          {
            in: 'query',
            name: 'sha256_hash',
            type: 'string',
          },
          {
            in: 'query',
            name: 'oauth2_scope',
            type: 'string',
          },
          {
            in: 'header',
            name: 'X-Request-ID2',
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
};
