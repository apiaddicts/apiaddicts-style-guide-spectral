module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore Digit Param',
  },
  paths: {
    '/pets': {
      get: {
        parameters: [
          {
            in: 'query',
            name: 'total_2',
            schema: {
              type: 'integer',
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
