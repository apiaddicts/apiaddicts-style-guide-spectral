module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  tags: [
    {
      name: 'used-tag',
      description: 'A tag referenced in the operations',
    },
    {
      name: 'undescribed-tag',
    },
    {
      name: 'used-tag',
      description: 'A duplicate declaration of used-tag',
    },
  ],
  paths: {
    '/pets': {
      get: {
        tags: ['used-tag', 'undescribed-tag', 'unlisted-tag'],
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
};
