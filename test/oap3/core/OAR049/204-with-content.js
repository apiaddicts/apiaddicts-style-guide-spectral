module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'OAR049 Content Fixture API',
  },
  paths: {
    '/pets/{petId}': {
      delete: {
        summary: 'Delete a pet',
        responses: {
          204: {
            description: 'Pet deleted, but a schema was wrongly left in place',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Replace a pet',
        responses: {
          204: {
            description: 'Pet replaced, but a schema was wrongly left in place',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  },
};
