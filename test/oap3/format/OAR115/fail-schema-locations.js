module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR115 schema locations' },
  paths: {
    '/inline': {
      get: {
        responses: {
          200: {
            description: 'inline response schema',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['missingInResponse'],
                  properties: { id: { type: 'integer' } },
                },
              },
            },
          },
        },
      },
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['missingInRequestBody'],
                properties: { other: { type: 'string' } },
              },
            },
          },
        },
        responses: { 204: { description: 'no content' } },
      },
    },
    '/nested': {
      get: {
        responses: {
          200: {
            description: 'nested schemas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    child: {
                      type: 'object',
                      required: ['missingInChild'],
                      properties: { x: { type: 'string' } },
                    },
                    list: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['missingInItems'],
                        properties: { value: { type: 'string' } },
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
    '/untyped': {
      get: {
        responses: {
          200: {
            description: 'response schema without an object type',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  required: ['missingInNonObjectResponse'],
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      InsideAllOf: {
        allOf: [
          {
            type: 'object',
            required: ['missingInAllOf'],
            properties: { a: { type: 'string' } },
          },
        ],
      },
      NonObjectOutsideResponse: {
        // Outside a response the object-type check applies, so this one is NOT reported.
        type: 'string',
        required: ['notReportedHere'],
      },
    },
  },
};
