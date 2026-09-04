module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR075 array-form fail' },
  paths: {
    '/users': {
      get: {
        parameters: [
          { name: 'nullLast', in: 'query', schema: { type: ['string', 'null'] } },
          { name: 'nullFirst', in: 'query', schema: { type: ['null', 'string'] } },
          { name: 'singleton', in: 'query', schema: { type: ['string'] } },
          { name: 'twoNonNull', in: 'query', schema: { type: ['string', 'integer'] } },
        ],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
};
