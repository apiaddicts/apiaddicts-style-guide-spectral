module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR049 Empty Fixture API',
  },
  paths: {
    '/orders': {
      get: {
        summary: 'Check for pending orders',
        responses: {
          204: {
            description: 'No pending orders',
          },
        },
      },
      post: {
        summary: 'Trigger an order reconciliation',
        responses: {
          204: {
            description: 'Reconciliation triggered',
          },
        },
      },
    },
    '/orders/{orderId}': {
      patch: {
        summary: 'Update an order silently',
        parameters: [
          {
            in: 'path',
            name: 'orderId',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          204: {
            description: 'Order updated',
          },
        },
      },
      head: {
        summary: 'Check if an order exists',
        parameters: [
          {
            in: 'path',
            name: 'orderId',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          204: {
            description: 'Order exists (irrelevant verb, must be ignored by OAR049)',
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  },
};
