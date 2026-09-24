module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 OpenAPI 3.0 shared path-item parameter - fail',
  },
  paths: {
    '/things/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};
