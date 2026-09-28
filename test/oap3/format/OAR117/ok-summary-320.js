module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.example.com/catalog/openapi.yaml',
  info: {
    version: '1.0.0',
    title: 'Catalog API',
    summary: 'Test sandbox catalog used by the untitled draft portal',
    description: 'Test description mentioning sandbox and untitled on purpose'
  },
  paths: {
    '/catalog': {
      get: { responses: { 200: { description: 'OK' } } },
      additionalOperations: {
        QUERY: { responses: { 200: { description: 'OK' } } }
      }
    }
  }
};
