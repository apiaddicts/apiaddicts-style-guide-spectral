module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR051 path target fixture',
  },
  paths: {
    '/pets': {
      get: {
        summary: 'List all pets',
        description: 'List all pets',
        responses: {
          default: {
            description: 'The default response',
          },
        },
      },
    },
  },
};
