module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR075 fail' },
  paths: {
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, type: 'string' },
      ],
      get: {
        parameters: [
          { name: 'q', in: 'query', type: 'string' },
          { name: 'X-Trace', in: 'header', type: 'string' },
          { name: 'field', in: 'formData', type: 'string' },
          { name: 'onlyFormat', in: 'query', type: 'string', format: 'date' },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  parameters: {
    Global: { name: 'global', in: 'query', type: 'string' },
  },
};
