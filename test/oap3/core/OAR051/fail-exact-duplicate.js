module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR051 exact duplicate fixture',
  },
  paths: {
    '/orders': {
      post: {
        summary: 'Create a new order ',
        description: 'CREATE A NEW ORDER',
        responses: {
          201: {
            description: 'Created',
          },
        },
      },
    },
  },
};
