module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 Swagger 2.0 — ok',
  },
  paths: {
    '/items': {
      get: {
        parameters: [
          { name: 'filter', in: 'query', type: 'string' },
        ],
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
        },
      },
    },
    '/things/{id}': {
      get: {
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
        ],
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
        },
      },
    },
    '/body-only': {
      post: {
        parameters: [
          { name: 'payload', in: 'body', required: true, schema: { type: 'object' } },
        ],
        responses: {
          '201': { description: 'Created' },
        },
      },
    },
  },
};
