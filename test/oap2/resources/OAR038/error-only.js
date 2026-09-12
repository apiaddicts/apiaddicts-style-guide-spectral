module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'Error Only API' },
  paths: {
    '/failures': {
      post: {
        responses: {
          201: {
            description: 'Created',
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
};
