module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Error Only API' },
  paths: {
    '/failures': {
      post: {
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'object',
                      properties: {
                        message: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
