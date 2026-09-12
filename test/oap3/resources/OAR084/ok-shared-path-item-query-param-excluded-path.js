module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore Shared Params',
  },
  paths: {
    '/accounts': {
      parameters: [
        { name: 'secret', in: 'query', schema: { type: 'string', format: 'password' } },
      ],
      get: {
        responses: { 200: { description: 'ok' } },
      },
    },
  },
};
