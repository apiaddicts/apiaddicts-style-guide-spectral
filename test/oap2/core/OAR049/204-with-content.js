module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR049 Content Fixture API',
  },
  paths: {
    '/pets/{petId}': {
      delete: {
        summary: 'Delete a pet',
        parameters: [
          {
            in: 'path',
            name: 'petId',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          204: {
            description: 'Pet deleted, but a schema was wrongly left in place',
            schema: {
              type: 'object',
            },
          },
        },
      },
      put: {
        summary: 'Replace a pet',
        parameters: [
          {
            in: 'path',
            name: 'petId',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          204: {
            description: 'Pet replaced, but a schema was wrongly left in place',
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  },
};
