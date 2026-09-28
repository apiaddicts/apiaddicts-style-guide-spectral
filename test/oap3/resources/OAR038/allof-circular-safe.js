const circularSchema = {
  type: 'object',
  allOf: [
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
  ],
};
circularSchema.allOf.push(circularSchema);

module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Circular AllOf API' },
  paths: {
    '/loops': {
      post: {
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: circularSchema,
              },
            },
          },
        },
      },
    },
  },
};
