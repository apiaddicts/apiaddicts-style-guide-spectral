module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Empty Properties API' },
  paths: {
    '/gadgets': {
      post: {
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
  },
};
