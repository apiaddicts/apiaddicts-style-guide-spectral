module.exports = {
  openapi: '3.1.0',
  info: { version: '1.0.0', title: 'Nullable Data API' },
  paths: {
    '/profiles': {
      post: {
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: ['object', 'null'],
                      properties: {
                        id: { type: 'string' },
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
