module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR010 fail example (mixed case)' },
  paths: {
    '/reports': {
      get: {
        responses: {
          200: {
            description: 'Only application/xml, mixed case',
            content: { 'Application/XML': { schema: { type: 'object' } } },
          },
        },
      },
      post: {
        responses: {
          200: { $ref: '#/components/responses/XmlOnlyResponse' },
        },
      },
    },
  },
  components: {
    responses: {
      XmlOnlyResponse: {
        description: 'Xml only response',
        content: { 'application/xml': { schema: { type: 'object' } } },
      },
    },
  },
};
