module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR075 fail format exemption' },
  paths: {
    '/users': {
      get: {
        parameters: [
          { name: 'ownerEmail', in: 'query', schema: { type: 'string', format: 'email' } },
          { name: 'target', in: 'query', schema: { type: 'string', format: 'hostname' } },
          { name: 'secret', in: 'query', schema: { type: 'string', format: 'password' } },
          { name: 'callback', in: 'query', schema: { type: 'string', format: 'uri' } },
          { name: 'blob', in: 'query', schema: { type: 'string', format: 'byte' } },
          { name: 'raw', in: 'query', schema: { type: 'string', format: 'binary' } },
          { name: 'custom', in: 'query', schema: { type: 'string', format: 'foo' } },
          { name: 'numericFormat', in: 'query', schema: { type: 'string', format: 123 } },
          { name: 'nullFormat', in: 'query', schema: { type: 'string', format: null } },
          { name: 'arrayFormat', in: 'query', schema: { type: 'string', format: ['date'] } },
          { name: 'objectFormat', in: 'query', schema: { type: 'string', format: {} } },
          { name: 'emptyFormat', in: 'query', schema: { type: 'string', format: '' } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  components: {
    parameters: {
      CustomFormatInComponents: { name: 'customFormatInComponents', in: 'query', schema: { type: 'string', format: 'foo' } },
    },
  },
};
