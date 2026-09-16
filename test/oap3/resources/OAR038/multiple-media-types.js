module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Multiple Media Types API' },
  paths: {
    '/documents': {
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
                      type: 'object',
                      properties: { id: { type: 'string' } },
                    },
                  },
                },
              },
              'application/xml': {
                schema: {
                  type: 'object',
                  properties: {
                    payload: {
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
