module.exports = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
  },
  tags: [
    {
      name: 'declared-tag',
      description: 'A tag declared at the top level',
    },
  ],
  paths: {},
  webhooks: {
    someHook: {
      post: {
        tags: ['declared-tag', 'undeclared-webhook-tag'],
        responses: {
          200: { description: 'OK' },
        },
      },
    },
  },
};
