module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR075 fail format exemption' },
  paths: {
    '/users': {
      get: {
        parameters: [
          // email and hostname only cap the maximum length, so they are not exempt.
          { name: 'ownerEmail', in: 'query', type: 'string', format: 'email' },
          { name: 'target', in: 'query', type: 'string', format: 'hostname' },
          { name: 'secret', in: 'query', type: 'string', format: 'password' },
          { name: 'callback', in: 'query', type: 'string', format: 'uri' },
          { name: 'blob', in: 'query', type: 'string', format: 'byte' },
          { name: 'raw', in: 'formData', type: 'string', format: 'binary' },
          { name: 'custom', in: 'query', type: 'string', format: 'foo' },
          { name: 'numericFormat', in: 'query', type: 'string', format: 123 },
          { name: 'nullFormat', in: 'query', type: 'string', format: null },
          { name: 'arrayFormat', in: 'query', type: 'string', format: ['date'] },
          { name: 'objectFormat', in: 'query', type: 'string', format: {} },
          { name: 'emptyFormat', in: 'query', type: 'string', format: '' },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  parameters: {
    Global: { name: 'global', in: 'query', type: 'string', format: 'foo' },
  },
};
