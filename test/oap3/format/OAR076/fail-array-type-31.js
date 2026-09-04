module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR076 array-form fail' },
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
                    missingNullLast: { type: ['integer', 'null'] },
                    missingNullFirst: { type: ['null', 'integer'] },
                    missingSingleton: { type: ['integer'] },
                    missingNullFormat: { type: ['integer', 'null'], format: null },
                    invalidUint32: { type: ['integer', 'null'], format: 'uint32' },
                    invalidNullFirst: { type: ['null', 'integer'], format: 'int128' },
                    invalidNumber: { type: ['number', 'null'], format: 'decimal' },
                    invalidTwoNonNull: { type: ['integer', 'string'], format: 'float' },
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
