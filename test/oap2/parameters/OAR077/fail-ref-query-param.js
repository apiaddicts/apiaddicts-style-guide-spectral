module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore Ref Param',
  },
  paths: {
    '/pets': {
      get: {
        parameters: [
          {
            $ref: '#/parameters/FilterParam',
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
    },
  },
  parameters: {
    FilterParam: {
      in: 'query',
      name: 'FilterType',
      type: 'string',
    },
  },
};
