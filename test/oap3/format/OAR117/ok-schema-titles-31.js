module.exports = {
  openapi: '3.1.0',
  info: { version: '1.0.0', title: 'Orders API' },
  paths: {
    '/orders': { get: { responses: { 200: { description: 'OK' } } } }
  },
  webhooks: {
    orderSettled: { post: { responses: { 200: { description: 'OK' } } } }
  },
  components: {
    schemas: {
      Order: {
        title: 'Test Order Schema',
        type: ['object', 'null'],
        properties: {
          id: { title: 'Test Identifier', type: ['string', 'null'] },
          total: { title: 'Sandbox Total', type: ['number', 'null'] }
        }
      }
    },
    parameters: {
      OrderId: { name: 'orderId', in: 'path', required: true, schema: { title: 'Test Param Title', type: ['string', 'null'] } }
    }
  }
};
