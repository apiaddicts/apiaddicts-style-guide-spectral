module.exports = {
  openapi: '3.0.1',
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
        responses: {
          204: {
            description: 'Order updated',
          },
        },
      },
      // "head" is not in the rule's given clause ([get,post,put,patch,delete]) - even though
      // this 204 wrongly carries content, it must never be flagged by OAR049.
      head: {
        summary: 'Check if an order exists',
        responses: {
          204: {
            description: 'Order exists (irrelevant verb, must be ignored by OAR049)',
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
