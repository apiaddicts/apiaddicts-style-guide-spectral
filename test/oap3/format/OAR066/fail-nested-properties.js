module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR066 nested properties fixture',
  },
  paths: {
    '/users': {
      post: {
        requestBody: {
          content: {
            'application/json': {
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
          },
        },
        responses: {
          201: { description: 'Created' },
        },
      },
    },
  },
};
