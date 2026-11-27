module.exports = {
  openapi: '3.0.3',
  info: { title: 'Fleet Telematics API', version: '1.0.0' },
  'x-server-catalog': {
    production: { url: 'https://fleet.example.com/api-fleet-telematics/v1', description: 'Production' },
    sandbox: { url: 'https://sandbox.fleet.example.com/api-fleet-telematics/v1', description: 'Sandbox' },
    alias: { $ref: '#/x-server-catalog/sandbox' },
    unused: { url: 'https://fleet.example.com/fleet-telematics/v1', description: 'Not referenced from servers' },
  },
  servers: [
    { $ref: '#/x-server-catalog/production' },
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
        servers: [{ $ref: '#/x-server-catalog/unused' }],
        get: { operationId: 'listVehicles', responses: { 200: { description: 'Vehicles' } } },
      },
    },
  },
};
