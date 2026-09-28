module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 OpenAPI 3.0 ref shared parameter - fail',
  },
  paths: {
    '/orders/{orderId}': {
      parameters: [
        { $ref: '#/components/parameters/OrderIdParam' },
      ],
      get: {
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
  components: {
    parameters: {
      OrderIdParam: { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
    },
  },
};
