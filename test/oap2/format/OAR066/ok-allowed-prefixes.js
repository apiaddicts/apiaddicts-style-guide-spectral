module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR066 allowed prefixes fixture',
  },
  host: 'petstore.swagger.io',
  basePath: '/v2',
  paths: {
    '/resources': {
      post: {
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                _leading: { type: 'string' },
                '@Custom': { type: 'string' },
                'x-custom-ext': { type: 'string' },
              },
            },
          },
        ],
        responses: {
          201: { description: 'Created' },
        },
      },
    },
  },
};
