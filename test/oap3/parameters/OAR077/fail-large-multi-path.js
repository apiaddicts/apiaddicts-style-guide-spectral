module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore Multi Path',
  },
  paths: {
    '/pets': {
      parameters: [
        {
          in: 'query',
          name: 'PetType',
          schema: {
            type: 'string',
          },
        },
      ],
      get: {
        parameters: [
          {
            in: 'query',
            name: 'sort_by',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
      post: {
        parameters: [
          {
            in: 'query',
            name: 'dryRun',
            schema: {
              type: 'boolean',
            },
          },
        ],
        responses: {
          201: {
            description: 'Created',
          },
        },
      },
    },
    '/orders': {
      parameters: [
        {
          in: 'query',
          name: 'order_status',
          schema: {
            type: 'string',
          },
        },
      ],
      get: {
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
      delete: {
        parameters: [
          {
            in: 'query',
            name: 'force',
            schema: {
              type: 'boolean',
            },
          },
        ],
        responses: {
          204: {
            description: 'No Content',
          },
        },
      },
    },
    '/invoices': {
      get: {
        parameters: [
          {
            in: 'path',
            name: 'invoiceId',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'InvoiceType',
            schema: {
              type: 'string',
            },
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
};
