module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 Swagger 2.0 shared path-item parameter - ok',
  },
  paths: {
    '/things/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, type: 'string' },
      ],
      get: {
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
        },
      },
    },
  },
};
