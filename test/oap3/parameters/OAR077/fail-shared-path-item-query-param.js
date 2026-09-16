module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore Shared Params',
  },
  paths: {
    '/pets': {
      parameters: [
        {
          in: 'query',
          name: 'PetType',
          schema: {
            type: 'string',
          },
        },
      ],
      get: {
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
    },
  },
};
