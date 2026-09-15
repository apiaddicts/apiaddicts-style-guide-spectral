module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR075 fail format exemption array-form' },
  paths: {
    '/users': {
      get: {
        parameters: [
          { name: 'nullLastCustom', in: 'query', schema: { type: ['string', 'null'], format: 'foo' } },
          { name: 'twoNonNullPassword', in: 'query', schema: { type: ['string', 'integer'], format: 'password' } },
          { name: 'singletonNumericFormat', in: 'query', schema: { type: ['string'], format: 123 } },
          { name: 'nullableEmail', in: 'query', schema: { type: ['string', 'null'], format: 'email' } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
};
