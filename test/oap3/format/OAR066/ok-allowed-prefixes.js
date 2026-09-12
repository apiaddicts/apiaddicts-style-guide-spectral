module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR066 allowed prefixes fixture',
  },
  paths: {
    '/resources': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  _leading: { type: 'string' },
                  '@Custom': { type: 'string' },
                  'x-custom-ext': { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Created' },
        },
      },
    },
  },
};
