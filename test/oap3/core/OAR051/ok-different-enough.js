module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR051 different enough fixture',
  },
  paths: {
    '/users': {
      get: {
        summary: 'Retrieve the list of active users',
        description: 'Purges all expired authentication tokens from the cache',
        responses: {
          200: {
            description: 'OK',
          },
        },
      },
    },
  },
};
