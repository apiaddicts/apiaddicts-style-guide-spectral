module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  tags: [
    {
      name: 'tag-1',
      description: 'A tag referenced in the operations',
    },
    {
      name: 'tag-2',
      description: 'Another tag referenced in the operations',
    },
  ],
  paths: {
    '/pets': {
      get: {
        tags: ['tag-1', 'tag-2'],
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
};
