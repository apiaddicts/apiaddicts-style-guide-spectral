module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 Swagger 2.0 — fail',
  },
  paths: {
    '/items': {
      get: {
        parameters: [
          { name: 'filter', in: 'query', type: 'string' },
        ],
        responses: {
          '200': { description: 'OK' },
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
        },
      },
    },
  },
};
