module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  tags: [
    {
      name: 'pets',
    },
  ],
  paths: {
    '/pets': {
      get: {
        tags: ['pets'],
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
};
