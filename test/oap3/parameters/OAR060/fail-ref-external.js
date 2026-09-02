module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets': {
      get: {
        parameters: [
          { $ref: './common.yaml#/components/parameters/External' },
          { in: 'query', name: 'inline', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
