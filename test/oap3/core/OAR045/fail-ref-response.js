module.exports = {
  openapi: '3.0.0',
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
            $ref: '#/components/responses/Created',
          },
        },
      },
    },
  },
  components: {
    responses: {
      Created: {
        description: 'Order created, but the schema was forgotten',
      },
    },
  },
};
