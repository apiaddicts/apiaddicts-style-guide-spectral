module.exports = {
  openapi: '3.0.3',
  info: { version: '1.0.0', title: 'Pruébà de Facturación 😀' },
  paths: {
    '/facturas': { get: { responses: { 200: { description: 'OK' } } } }
  }
};
