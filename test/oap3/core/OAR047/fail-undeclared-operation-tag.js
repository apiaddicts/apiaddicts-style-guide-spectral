module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  tags: [
    {
      name: 'used-tag',
      description: 'A tag referenced by an operation',
    },
  ],
  paths: {
    '/pets': {
      get: {
        tags: ['used-tag', 'unlisted-tag'],
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
};
