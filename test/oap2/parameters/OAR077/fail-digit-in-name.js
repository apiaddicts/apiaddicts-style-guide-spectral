module.exports = {
  swagger: '2.0',
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
            type: 'integer',
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
