module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR037 non-schema nodes' },
  paths: {
    '/things': {
      get: {
        responses: {
          200: {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', format: 'uuid' },
                    example: { type: 'string', format: 'date' },
                    withDefault: {
                      type: 'string',
                      format: 'email',
                      default: { type: 'string' },
                    },
                    withEnum: {
                      type: 'string',
                      format: 'uri',
                      enum: [{ type: 'string' }],
                    },
                  },
                },
                example: {
                  name: 'abc',
                  nested: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};
