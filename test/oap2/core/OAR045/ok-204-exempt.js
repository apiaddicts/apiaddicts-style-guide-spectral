module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
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
            description: 'Pet deleted, no content',
          },
        },
      },
    },
  },
};
