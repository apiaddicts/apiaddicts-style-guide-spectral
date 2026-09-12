module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 Swagger 2.0 shared and operation distinct params - fail',
  },
  paths: {
    '/things/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, type: 'string' },
      ],
      get: {
        parameters: [
          { name: 'filter', in: 'query', type: 'string' },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};
