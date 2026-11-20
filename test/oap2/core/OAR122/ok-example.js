const responses = { 200: { description: 'Ok' }, default: { description: 'Unexpected error' } };
const vehicleId = { name: 'vehicleId', in: 'path', required: true, type: 'string', format: 'uuid' };

module.exports = {
  swagger: '2.0',
  info: { title: 'Fleet Maintenance API', version: '1.6.0', description: 'Vehicles, work orders and inspections.' },
  host: 'fleet-service:8080',
  basePath: '/api-fleet/v1',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/vehicles': {
      get: { operationId: 'listVehicles', schemes: ['wss'], responses },
      post: {
        operationId: 'registerVehicle',
        parameters: [{ name: 'vehicle', in: 'body', required: true, schema: { $ref: '#/definitions/Vehicle' } }],
        responses,
      },
    },
    '/vehicles/{vehicleId}/work-orders': {
      parameters: [vehicleId],
      get: { operationId: 'listWorkOrders', responses },
    },
  },
  definitions: {
    Vehicle: {
      type: 'object',
      required: ['plate'],
      properties: {
        plate: { type: 'string' },
        mileageKm: { type: 'integer', format: 'int32' },
      },
    },
  },
};
