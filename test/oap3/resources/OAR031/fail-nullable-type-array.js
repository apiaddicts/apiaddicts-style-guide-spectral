module.exports = {
  openapi: '3.1.0',
  info: {
    title: 'Swagger Petstore',
    version: '1.0.0',
  },
  paths: {
    '/pets': {
      get: {
        responses: {
          200: {
            description: 'Ok',
            content: {
              'application/json': {
                example: { id: 1 },
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: ['integer', 'null'],
                      example: 1,
                    },
                    address: {
                      type: ['object', 'null'],
                      properties: {
                        city: {
                          type: 'string',
                        },
                      },
                    },
                    tags: {
                      type: ['array', 'null'],
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
