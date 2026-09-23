module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'Empty Properties API' },
  paths: {
    '/gadgets': {
      post: {
        responses: {
          201: {
            description: 'Created',
            schema: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
