module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  paths: {
    '/pets': {
      get: {
        parameters: [
          {
            in: 'query',
            name: 'Other',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'other-param',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: '$totalParam',
            type: 'boolean',
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
