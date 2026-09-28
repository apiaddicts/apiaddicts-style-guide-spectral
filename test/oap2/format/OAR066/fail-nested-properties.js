module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR066 nested properties fixture',
  },
  host: 'petstore.swagger.io',
  basePath: '/v2',
  paths: {
    '/users': {
      post: {
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                profile: {
                  type: 'object',
                  properties: {
                    contact_info: {
                      type: 'object',
                      properties: {
                        phoneNumber: { type: 'string' },
                      },
                    },
                  },
                },
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
