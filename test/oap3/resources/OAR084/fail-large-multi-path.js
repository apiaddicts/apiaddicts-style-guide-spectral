module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore Multi Path',
  },
  paths: {
    '/accounts': {
      parameters: [
        { name: 'secret', in: 'query', schema: { type: 'string', format: 'password' } },
      ],
      get: {
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'ok' } },
      },
      post: {
        parameters: [
          { name: 'pwd', in: 'query', schema: { type: 'string', format: 'password' } },
        ],
        responses: { 201: { description: 'created' } },
      },
    },
    '/sessions': {
      get: {
        parameters: [
          { name: 'token', in: 'query', schema: { type: 'string', format: 'password' } },
          { name: 'notify', in: 'query', schema: { type: 'string', format: 'email' } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
};
