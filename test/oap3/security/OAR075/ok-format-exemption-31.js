module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR075 ok format exemption array-form' },
  paths: {
    '/users': {
      get: {
        parameters: [
          { name: 'nullLast', in: 'query', schema: { type: ['string', 'null'], format: 'uuid' } },
          { name: 'nullFirst', in: 'query', schema: { type: ['null', 'string'], format: 'date-time' } },
          { name: 'singleton', in: 'query', schema: { type: ['string'], format: 'ipv6' } },
          { name: 'twoNonNull', in: 'query', schema: { type: ['string', 'integer'], format: 'ipv4' } },
          { name: 'upperCase', in: 'query', schema: { type: ['string', 'null'], format: 'DATE' } },
          { name: 'numericArray', in: 'query', schema: { type: ['integer', 'null'], format: 'int64' } },
          { name: 'onlyNull', in: 'query', schema: { type: ['null'], format: 'foo' } },
          { name: 'emptyTypeArray', in: 'query', schema: { type: [], format: 'foo' } },
          { name: 'nullType', in: 'query', schema: { type: null, format: 'foo' } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
};
