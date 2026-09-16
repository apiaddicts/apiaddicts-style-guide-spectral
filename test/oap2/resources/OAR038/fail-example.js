module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'Swagger Petstore' },
  paths: {
    '/items': {
      post: {
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              properties: {
                result: { type: 'object' },
                database: { type: 'object' },
              },
            },
          },
        },
      },
    },
  },
};
