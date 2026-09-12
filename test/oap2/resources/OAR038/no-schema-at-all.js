module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'No Schema API' },
  paths: {
    '/widgets': {
      post: {
        responses: {
          201: {
            description: 'Created',
          },
        },
      },
    },
  },
};
