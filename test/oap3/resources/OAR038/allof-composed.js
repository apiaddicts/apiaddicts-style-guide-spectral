module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'AllOf Composed API' },
  paths: {
    '/gizmos': {
      post: {
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
