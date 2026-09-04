module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR076 array-form ok' },
  paths: {
    '/invoices': {
      get: {
        responses: {
          200: {
            description: 'An invoice.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nullLast: { type: ['integer', 'null'], format: 'int32' },
                    nullFirst: { type: ['null', 'integer'], format: 'int64' },
                    singleton: { type: ['integer'], format: 'int64' },
                    twoNonNull: { type: ['integer', 'string'], format: 'int32' },
                    numberArray: { type: ['number', 'null'], format: 'double' },
                    numberNullFirst: { type: ['null', 'number'], format: 'float' },
                    trimmedFormat: { type: ['integer', 'null'], format: '  int64  ' },
                    blankFormat: { type: ['integer', 'null'], format: '' },
                    whitespaceFormat: { type: ['integer', 'null'], format: '   ' },
                    onlyNull: { type: ['null'] },
                    nullScalar: { type: 'null' },
                    stringArray: { type: ['string', 'null'] },
                    booleanArray: { type: ['boolean', 'null'] },
                    emptyTypeArray: { type: [] },
                    nullTypeValue: { type: null },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
