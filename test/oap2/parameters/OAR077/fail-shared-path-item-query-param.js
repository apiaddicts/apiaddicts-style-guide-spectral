module.exports = {
  swagger: '2.0',
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
          type: 'string',
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
