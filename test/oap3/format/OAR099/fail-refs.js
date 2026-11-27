module.exports = {
  openapi: '3.0.3',
  info: { title: 'Fleet Telematics API', version: '1.0.0' },
  'x-server-catalog': {
    production: { url: 'https://fleet.example.com/api-fleet-telematics/v1', description: 'Production' },
    legacy: { url: 'https://fleet.example.com/fleet-telematics/v1', description: 'Legacy' },
    alias: { $ref: '#/x-server-catalog/partner' },
    partner: { url: 'https://partners.example.com/telematics/v1', description: 'Partner gateway' },
  },
  servers: [
    { $ref: '#/x-server-catalog/production' },
    { $ref: '#/x-server-catalog/legacy' },
    { $ref: '#/x-server-catalog/alias' },
  ],
  paths: {
    '/vehicles': {
      $ref: '#/components/x-path-items/Vehicles',
    },
  },
  components: {
    'x-path-items': {
      Vehicles: {
        servers: [{ $ref: '#/x-server-catalog/legacy' }],
        get: { operationId: 'listVehicles', responses: { 200: { description: 'Vehicles' } } },
      },
    },
  },
};
