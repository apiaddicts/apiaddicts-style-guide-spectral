module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Custom Data Property API' },
  paths: {
    '/reports': {
      post: {
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    result: {
                      type: 'object',
                      properties: { id: { type: 'string' } },
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
