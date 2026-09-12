module.exports = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Orders API',
  },
  paths: {
    '/orders/{orderId}': {
      get: {
        summary: 'Get an order, which may not have been assigned yet',
        parameters: [
          {
            in: 'path',
            name: 'orderId',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'The order, or null if not yet assigned',
            content: {
              'application/json': {
                schema: {
                  type: ['object', 'null'],
                },
              },
            },
          },
        },
      },
    },
  },
};
