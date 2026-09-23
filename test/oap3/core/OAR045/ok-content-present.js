module.exports = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Orders API',
  },
  paths: {
    '/orders': {
      post: {
        summary: 'Create an order',
        responses: {
          201: {
            description: 'Order created',
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
