module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR108 array-form ok' },
  paths: {
    '/items': {
      get: {
        responses: {
          200: {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nullLast: { type: ['integer', 'null'] },
                    nullFirst: { type: ['null', 'integer'] },
                    singleton: { type: ['string'] },
                    twoNonNull: { type: ['integer', 'string'] },
                    numberWithInteger: { type: ['number', 'null'] },
                    numberWithDecimal: { type: ['number', 'null'] },
                    nullValue: { type: ['integer', 'null'] },
                    untyped: { description: 'no type' },
                    flag: { type: ['boolean', 'null'] },
                    list: { type: ['array', 'null'] },
                    obj: { type: ['object', 'null'] },
                  },
                },
                example: {
                  nullLast: 1,
                  nullFirst: 2,
                  singleton: 'ok',
                  twoNonNull: 3,
                  numberWithInteger: 5,
                  numberWithDecimal: 5.5,
                  nullValue: null,
                  untyped: 'anything',
                  flag: true,
                  list: [1, 2],
                  obj: { x: 1 },
                  extraNotInSchema: 'ignored',
                },
              },
            },
          },
          204: { description: 'no content, nothing to compare' },
        },
      },
    },
  },
};
