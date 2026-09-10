module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR075 fail' },
  paths: {
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'X-Trace', in: 'header', schema: { type: 'string' } },
          { name: 'sid', in: 'cookie', schema: { type: 'string' } },
          { name: 'onlyFormat', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  components: {
    parameters: {
      InComponents: { name: 'inComponents', in: 'query', schema: { type: 'string' } },
    },
  },
};
