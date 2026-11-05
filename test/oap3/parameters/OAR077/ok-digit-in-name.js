module.exports = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  servers: [
    {
      url: 'https://api.example.com/onboarding/v1',
    },
  ],
  paths: {
    '/customers': {
      parameters: [
        {
          in: 'query',
          name: 'address_line2',
          schema: {
            type: 'string',
          },
        },
      ],
      get: {
        parameters: [
          {
            in: 'query',
            name: 'onboarding_status1',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'total_2',
            schema: {
              type: 'integer',
            },
          },
          {
            in: 'query',
            name: 'page_2_size',
            schema: {
              type: 'integer',
            },
          },
          {
            in: 'query',
            name: 'top10',
            schema: {
              type: 'boolean',
            },
          },
          {
            in: 'query',
            name: '$top',
            schema: {
              type: 'integer',
            },
          },
          {
            in: 'query',
            name: '_page2',
            schema: {
              type: 'integer',
            },
          },
          {
            in: 'query',
            name: '$_v2_filter',
            schema: {
              type: 'string',
            },
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
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'sha256_hash',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'oauth2_scope',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'header',
            name: 'X-Request-ID2',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'cookie',
            name: 'SessionId2',
            schema: {
              type: 'string',
            },
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
