module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR108 array-form fail' },
  paths: {
    '/other-path': {
      get: {
        responses: {
          200: {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nullLast: { type: ['integer', 'null'] },
                    nullFirst: { type: ['null', 'integer'] },
                  },
                },
                example: { nullLast: 'bad', nullFirst: 'bad' },
              },
            },
          },
          404: {
            description: 'a response code other than 200 is inspected too',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { code: { type: ['integer', 'null'] } } },
                example: { code: 'bad' },
              },
            },
          },
        },
      },
      post: {
        responses: {
          201: {
            description: 'an operation other than get is inspected too',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { id: { type: ['integer', 'null'] } } },
                example: { id: '123' },
              },
            },
          },
        },
      },
    },
  },
};
