module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  paths: {
    '/pets': {
      get: {
        summary: 'List all pets',
        responses: {
          200: {
            description: 'A paged array of pets',
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  },
};
