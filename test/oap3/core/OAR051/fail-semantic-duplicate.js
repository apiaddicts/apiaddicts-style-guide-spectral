module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR051 semantic duplicate fixture',
  },
  paths: {
    '/users': {
      get: {
        summary: 'Retrieve the list of active users in the system',
        description: 'Fetches the active users currently in the system',
        responses: {
          200: {
            description: 'OK',
          },
        },
      },
    },
  },
};
