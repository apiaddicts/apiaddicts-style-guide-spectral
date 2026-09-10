module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR075 ok' },
  paths: {
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', minLength: 1 } },
      ],
      get: {
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string', maxLength: 10 } },
          { name: 'X-Trace', in: 'header', schema: { type: 'string', pattern: '^[a-z]+$' } },
          { name: 'sid', in: 'cookie', schema: { type: 'string', enum: ['a', 'b'] } },
          { name: 'numeric', in: 'query', schema: { type: 'integer' } },
          { name: 'boolean', in: 'query', schema: { type: 'boolean' } },
          { name: 'untyped', in: 'query', schema: { description: 'no type' } },
          {
            name: 'noSchema',
            in: 'query',
            content: { 'application/json': { schema: { type: 'string' } } },
          },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  components: {
    parameters: {
      InComponents: { name: 'inComponents', in: 'query', schema: { type: 'string', enum: ['a'] } },
    },
  },
};
