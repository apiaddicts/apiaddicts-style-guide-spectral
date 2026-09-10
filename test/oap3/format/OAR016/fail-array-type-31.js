module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR016 array-form fail' },
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
                    nullLast: { type: ['integer', 'null'], format: 'uint32' },
                    nullFirst: { type: ['null', 'integer'], format: 'uint64' },
                    singleton: { type: ['integer'], format: 'float' },
                    twoNonNull: { type: ['integer', 'string'], format: 'int128' },
                    numberArray: { type: ['number', 'null'], format: 'decimal' },
                    numberNullFirst: { type: ['null', 'number'], format: 'int32' },
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
