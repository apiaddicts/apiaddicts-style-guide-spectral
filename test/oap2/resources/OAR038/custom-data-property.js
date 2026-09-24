module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'Custom Data Property API' },
  paths: {
    '/reports': {
      post: {
        responses: {
          201: {
            description: 'Created',
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
};
