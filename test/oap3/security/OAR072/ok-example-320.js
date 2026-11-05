module.exports = {
  openapi: '3.2.0',
  info: { title: 'Device Firmware API', version: '3.0.0' },
  servers: [{ url: 'https://api.devices.example.com/v3' }],
  paths: {
    '/firmware': {
      query: {
        operationId: 'searchFirmware',
        responses: {
          200: { description: 'Builds with their crash stack traces', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Build' } } } } },
          400: { description: 'Invalid query', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, stackTrace: false } } } } },
        },
      },
      get: {
        operationId: 'streamCrashes',
        responses: {
          200: { description: 'Crash reports', content: { 'application/jsonl': { itemSchema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } },
          503: { description: 'Feed down', content: { 'text/event-stream': { itemSchema: { type: 'object', properties: { event: { type: 'string' }, traceId: { type: 'string' } } } } } },
        },
      },
      additionalOperations: {
        LINK: {
          operationId: 'linkFirmware',
          responses: {
            200: { description: 'Linked', content: { 'application/json': { schema: { $ref: '#/components/schemas/Build' } } } },
            409: { description: 'Already linked', content: { 'application/json': { $ref: '#/components/mediaTypes/PlainError' } } },
          },
        },
      },
    },
  },
  webhooks: {
    crashReported: {
      query: { responses: { 500: { description: 'Subscriber failure', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } } } },
    },
  },
  components: {
    mediaTypes: {
      PlainError: { schema: { type: 'object', properties: { code: { type: 'string' } } } },
      UnusedDebug: { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } },
    },
    schemas: {
      Build: { type: 'object', properties: { version: { type: 'string' }, stackTrace: { type: 'string' } } },
    },
  },
};
