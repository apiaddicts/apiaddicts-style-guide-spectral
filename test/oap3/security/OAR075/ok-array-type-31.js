module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR075 array-form ok' },
  paths: {
    '/users': {
      get: {
        parameters: [
          { name: 'nullLast', in: 'query', schema: { type: ['string', 'null'], minLength: 1 } },
          { name: 'nullFirst', in: 'query', schema: { type: ['null', 'string'], maxLength: 10 } },
          { name: 'singleton', in: 'query', schema: { type: ['string'], pattern: '^[a-z]+$' } },
          { name: 'twoNonNull', in: 'query', schema: { type: ['string', 'integer'], enum: ['a'] } },
          { name: 'onlyNull', in: 'query', schema: { type: ['null'] } },
          { name: 'nullScalar', in: 'query', schema: { type: 'null' } },
          { name: 'numeric', in: 'query', schema: { type: ['integer', 'null'] } },
          { name: 'emptyTypeArray', in: 'query', schema: { type: [] } },
          { name: 'nullTypeValue', in: 'query', schema: { type: null } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
};
