module.exports = {
  openapi: '3.1.1',
  info: { version: '1.0.0', title: 'OAR052 array-form fail' },
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
                    nullLast: { type: ['integer', 'null'] },
                    nullFirst: { type: ['null', 'integer'] },
                    singleton: { type: ['integer'] },
                    twoNonNull: { type: ['integer', 'string'] },
                    numberArray: { type: ['number', 'null'] },
                    nullFormat: { type: ['integer', 'null'], format: null },
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
