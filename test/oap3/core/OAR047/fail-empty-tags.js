module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  tags: [],
  paths: {
    '/pets': {
      get: {
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
};
