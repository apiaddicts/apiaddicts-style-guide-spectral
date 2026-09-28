module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR010 ok example (mixed case)' },
  paths: {
    '/reports': {
      get: {
        responses: {
          200: {
            description: 'Mixed-case default media type',
            content: { 'Application/JSON': { schema: { type: 'object' } } },
          },
        },
      },
      post: {
        responses: {
          200: { $ref: '#/components/responses/JsonOkResponse' },
        },
      },
    },
  },
  components: {
    responses: {
      JsonOkResponse: {
        description: 'Json ok response',
        content: { 'application/json': { schema: { type: 'object' } } },
      },
    },
  },
};
