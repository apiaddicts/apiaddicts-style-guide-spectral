module.exports = {
  openapi: '3.0.3',
  info: { title: 'Media Library API', version: '1.0.0' },
  servers: [{ url: 'https://api.media.example.com' }],
  security: [
    { NoType: [] },
    { NumericType: [] },
    { NullType: [] },
    { BlankType: [] },
    { ListType: [] },
    { NotAnObject: [] },
  ],
  paths: {
    '/albums': { get: { operationId: 'listAlbums', responses: { 200: { description: 'Albums' } } } },
  },
  components: {
    securitySchemes: {
      NoType: { in: 'header', name: 'X-Key' },
      NumericType: { type: 7 },
      NullType: { type: null, scheme: 'basic' },
      BlankType: { type: '   ' },
      ListType: { type: ['apiKey'] },
      NotAnObject: 'apiKey',
    },
  },
};
