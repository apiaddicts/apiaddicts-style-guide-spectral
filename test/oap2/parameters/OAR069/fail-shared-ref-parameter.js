module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 Swagger 2.0 ref shared parameter - fail',
  },
  paths: {
    '/orders/{orderId}': {
      parameters: [
        { $ref: '#/parameters/OrderIdParam' },
      ],
      get: {
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
  parameters: {
    OrderIdParam: { name: 'orderId', in: 'path', required: true, type: 'string' },
  },
};
