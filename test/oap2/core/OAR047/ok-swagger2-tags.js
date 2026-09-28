module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  tags: [
    {
      name: 'pets',
      description: 'Operations about pets',
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
