module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Tracking API', version: '6.1.0' },
  servers: [{ url: 'https://api.logistics.example.com/v6' }],
  paths: {
    '/shipments': {
      get: {
        operationId: 'listShipments',
        responses: {
          200: { description: 'Shipments', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Shipment' } } } } },
          400: {
            description: 'Nullable error body',
            content: {
              'application/json': {
                schema: {
                  type: ['object', 'null'],
                  properties: {
                    message: { type: ['string', 'null'] },
                    stackTrace: { type: ['string', 'null'] },
                    forbiddenTrace: false,
                    stack_trace: false,
                    rawStackTrace: true,
                  },
                },
              },
            },
          },
          422: {
            description: 'Validation errors as a nullable array',
            content: {
              'application/json': {
                schema: { type: ['array', 'null'], items: { type: 'object', properties: { pointer: { type: 'string' }, StackTrace: { type: ['string', 'null'] } } } },
              },
            },
          },
          500: {
            description: 'Positional error tuple',
            content: {
              'application/json': {
                schema: { type: 'array', prefixItems: [{ type: 'integer' }, { type: 'object', properties: { 'stack-trace': { type: 'string' } } }] },
              },
            },
          },
        },
      },
      post: {
        operationId: 'createShipment',
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Shipment' } } } },
          409: {
            description: 'Conditional debug fields',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { debug: { type: 'boolean' } },
                  if: { properties: { debug: { const: true } }, required: ['debug'] },
                  then: { properties: { debugStackTrace: { type: 'string' } } },
                  else: { properties: { STACK_TRACE: { type: 'string' } } },
                  dependentSchemas: { debug: { properties: { 'Stack.Trace': { type: 'string' } } } },
                },
              },
            },
          },
          415: {
            description: 'Open error maps',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  patternProperties: { '^x-': { type: 'object', properties: { stackTraceLines: { type: 'array', items: { type: 'string' } } } } },
                  unevaluatedProperties: { type: 'object', properties: { stacktrace: { type: 'string' } } },
                },
              },
            },
          },
          429: {
            description: 'Throttling events',
            content: {
              'application/json': {
                schema: { type: 'array', contains: { type: 'object', properties: { exceptionStackTrace: { type: 'string' } } } },
              },
            },
          },
          default: { description: 'Problem with $defs', content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem/$defs/Debug' } } } },
        },
      },
    },
    '/shipments/{shipmentId}/events': { $ref: '#/components/pathItems/ShipmentEvents' },
  },
  webhooks: {
    shipmentDelivered: {
      post: {
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Shipment' } } } },
        responses: { 500: { description: 'Subscriber failure', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } } },
      },
    },
  },
  components: {
    pathItems: {
      ShipmentEvents: {
        parameters: [{ name: 'shipmentId', in: 'path', required: true, schema: { type: 'string' } }],
        get: {
          operationId: 'listShipmentEvents',
          responses: {
            200: { description: 'Events', content: { 'application/json': { schema: { type: 'array', items: { type: 'string' } } } } },
            503: { description: 'Event store down', content: { 'application/json': { schema: { type: 'object', properties: { eventStoreStackTrace: { type: 'string' } } } } } },
          },
        },
      },
    },
    schemas: {
      Shipment: { type: 'object', properties: { id: { type: 'string' }, status: { type: ['string', 'null'] } } },
      Problem: {
        type: 'object',
        properties: { title: { type: 'string' } },
        $defs: { Debug: { type: 'object', properties: { host: { type: 'string' }, Stack_Trace: { type: 'string' } } } },
      },
    },
  },
};
