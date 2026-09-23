module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.example.com/catalog/openapi.yaml',
  info: { version: '1.0.0', title: 'Untitled Catalog API' },
  paths: {
    '/catalog': {
      get: { responses: { 200: { description: 'OK' } } },
      additionalOperations: {
        QUERY: { responses: { 200: { description: 'OK' } } }
      }
    }
  },
  webhooks: {
    catalogRefreshed: { post: { responses: { 200: { description: 'OK' } } } }
  }
};
