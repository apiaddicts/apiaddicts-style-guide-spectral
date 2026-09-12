module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 OpenAPI 3.0 operation overrides shared parameter - fail',
  },
  paths: {
    '/things/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Overrides the shared id parameter',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};
