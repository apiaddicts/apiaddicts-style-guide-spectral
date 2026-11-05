module.exports = {
  swagger: '2.0',
  info: { title: 'Fleet Telemetry API', version: '1.9.0', description: 'Vehicle positions and diagnostics.' },
  host: 'api.fleet.example.com',
  basePath: '/telemetry',
  schemes: ['https'],
  produces: ['application/json'],
  paths: {
    '/vehicles': {
      get: {
        operationId: 'listVehicles',
        responses: {
          200: {
            description: 'Vehicles with their last diagnostic snapshot',
            schema: { type: 'array', items: { $ref: '#/definitions/DebugSnapshot' } },
          },
          400: {
            description: 'Invalid filter, never returns a stack trace',
            schema: {
              type: 'object',
              properties: {
                traceId: { type: 'string' },
                stack: { type: 'string' },
                trace: { type: 'string' },
                backtrace: { type: 'string' },
                traceback: { type: 'string' },
                callStack: { type: 'string' },
                stackDepth: { type: 'integer' },
                errorTrace: { type: 'string' },
              },
            },
            examples: { 'application/json': { traceId: 'a1', stackTrace: 'hidden in production' } },
          },
          500: { description: 'Server error without body' },
          503: { description: 'Unavailable', schema: { type: 'string', example: 'stackTrace' } },
          'x-error-catalog': { description: 'Internal catalogue', schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } },
        },
      },
    },
    '/vehicles/{vehicleId}/diagnostics': {
      parameters: [{ name: 'vehicleId', in: 'path', required: true, type: 'string' }],
      get: {
        operationId: 'getDiagnostics',
        responses: {
          200: {
            description: 'Raw diagnostics including the firmware stack trace',
            schema: { type: 'object', properties: { stackTrace: { type: 'string' }, firmware: { type: 'string' } } },
          },
          404: {
            description: 'Vehicle not found',
            schema: { type: 'object', properties: { message: { type: 'string' }, 'x-debug': { type: 'string' } }, 'x-stackTrace': { type: 'string' } },
          },
        },
      },
      trace: {
        operationId: 'traceDiagnostics',
        responses: { 500: { description: 'Not an OpenAPI 2.0 method', schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } },
      },
    },
    'x-internal-paths': {
      get: { responses: { 500: { description: 'Extension', schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } },
    },
  },
  definitions: {
    DebugSnapshot: { type: 'object', properties: { vehicleId: { type: 'string' }, stackTrace: { type: 'string' } } },
    UnusedFailure: { type: 'object', properties: { stack_trace: { type: 'string' } } },
  },
};
