module.exports = {
  openapi: '3.1.0',
  info: { title: 'Energy Metering API', version: '2.0.0' },
  servers: [{ url: 'https://api.metering.example.com/v2' }],
  paths: {
    '/meters/{meterId}/readings': {
      parameters: [{ name: 'meterId', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        operationId: 'listReadings',
        responses: {
          200: {
            description: 'Readings with the collector stack trace',
            content: { 'application/json': { schema: { type: ['object', 'null'], properties: { readings: { type: 'array' }, stackTrace: { type: ['string', 'null'] } } } } },
          },
          400: {
            description: 'Stack traces are explicitly forbidden',
            content: {
              'application/json': {
                schema: {
                  type: ['object', 'null'],
                  properties: { message: { type: ['string', 'null'] }, stackTrace: false, stack_trace: false },
                  if: { properties: { stackTrace: { type: 'string' } }, required: ['stackTrace'] },
                  then: { properties: { message: { const: 'stack traces are not returned' } } },
                  not: { properties: { StackTrace: { type: 'string' } }, required: ['StackTrace'] },
                  propertyNames: { not: { pattern: '^stack' } },
                },
              },
            },
          },
          404: {
            description: 'Names that only look alike',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { stackId: { type: 'string' }, traceParent: { type: 'string' }, stack: { type: 'array', prefixItems: [{ type: 'string' }] } },
                  required: ['stackId'],
                  examples: [{ stackId: 's1', stackTrace: 'not part of the model' }],
                },
              },
            },
          },
        },
      },
    },
  },
  webhooks: {
    meterAlarm: {
      post: {
        responses: {
          500: { description: 'Subscriber failure', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } },
        },
      },
    },
  },
  components: {
    pathItems: {
      UnusedDiagnostics: {
        get: { responses: { 500: { description: 'Unused', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } } } },
      },
    },
  },
};
