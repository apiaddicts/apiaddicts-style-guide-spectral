module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR075 ok' },
  paths: {
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, type: 'string', minLength: 1 },
      ],
      get: {
        parameters: [
          { name: 'q', in: 'query', type: 'string', maxLength: 10 },
          { name: 'X-Trace', in: 'header', type: 'string', pattern: '^[a-z]+$' },
          { name: 'field', in: 'formData', type: 'string', enum: ['a', 'b'] },
          { name: 'numeric', in: 'query', type: 'integer' },
          { name: 'boolean', in: 'query', type: 'boolean' },
          { name: 'body', in: 'body', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  parameters: {
    Global: { name: 'global', in: 'query', type: 'string', enum: ['a'] },
  },
};
