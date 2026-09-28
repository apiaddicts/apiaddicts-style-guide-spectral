module.exports = {
  openapi: '3.1.0',
  info: { version: '1.0.0', title: 'Sandbox Orders API' },
  paths: {
    '/orders': { get: { responses: { 200: { description: 'OK' } } } }
  },
  webhooks: {
    orderSettled: { post: { responses: { 200: { description: 'OK' } } } }
  },
  components: {
    schemas: {
      Order: { type: ['object', 'null'], properties: { id: { type: ['string', 'null'] } } }
    }
  }
};
