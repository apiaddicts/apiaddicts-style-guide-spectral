module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OneOf Not Merged API' },
  paths: {
    '/choices': {
      post: {
        responses: {
          201: {
            description: 'Created',
            schema: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    data: { type: 'object', properties: { id: { type: 'string' } } },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    error: { type: 'object', properties: { message: { type: 'string' } } },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
};
