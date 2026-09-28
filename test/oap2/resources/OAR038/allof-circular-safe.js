const circularSchema = {
  type: 'object',
  allOf: [
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
      },
    },
  ],
};
circularSchema.allOf.push(circularSchema);

module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'Circular AllOf API' },
  paths: {
    '/loops': {
      post: {
        responses: {
          201: {
            description: 'Created',
            schema: circularSchema,
          },
        },
      },
    },
  },
};
