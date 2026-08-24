module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR060' },
  paths: {
    '/pets/{id}': {
      post: {
        parameters: [
          { in: 'path', name: 'id', type: 'string', required: true },
          { in: 'header', name: 'X-Trace', type: 'string', required: true },
          { in: 'formData', name: 'file', type: 'file', required: true },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};
