module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 Swagger 2.0 operation overrides shared parameter - fail',
  },
  paths: {
    '/things/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, type: 'string' },
      ],
      get: {
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string', description: 'Overrides the shared id parameter' },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};
