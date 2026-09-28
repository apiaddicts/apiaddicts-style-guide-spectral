module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore Ref Param',
  },
  paths: {
    '/pets': {
      get: {
        parameters: [
          {
            $ref: '#/components/parameters/FilterParam',
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
  components: {
    parameters: {
      FilterParam: {
        in: 'query',
        name: 'FilterType',
        schema: {
          type: 'string',
        },
      },
    },
  },
};
