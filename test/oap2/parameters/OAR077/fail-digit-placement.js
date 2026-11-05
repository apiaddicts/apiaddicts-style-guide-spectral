module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  paths: {
    '/customers': {
      get: {
        parameters: [
          {
            in: 'query',
            name: '2fa_code',
            type: 'string',
          },
          {
            in: 'query',
            name: '_2fa',
            type: 'string',
          },
          {
            in: 'query',
            name: '$2fa',
            type: 'string',
          },
          {
            in: 'query',
            name: 'status1_',
            type: 'string',
          },
          {
            in: 'query',
            name: 'line__2',
            type: 'string',
          },
          {
            in: 'query',
            name: 'Status1',
            type: 'string',
          },
          {
            in: 'query',
            name: 'statusV2',
            type: 'string',
          },
          {
            in: 'query',
            name: 'status-1',
            type: 'string',
          },
          {
            in: 'query',
            name: 'status.1',
            type: 'string',
          },
          {
            in: 'query',
            name: '42',
            type: 'string',
          },
          {
            in: 'query',
            name: 'status_1',
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
