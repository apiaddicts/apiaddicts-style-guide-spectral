const responses = { 200: { description: 'Ok' }, default: { description: 'Unexpected error' } };
const shipmentId = { name: 'shipmentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Logistics Tracking API', version: '2.4.0', description: 'Tracks shipments, carriers and delivery events.' },
  servers: [
    { url: 'https://api.logistics.example.com/api-tracking/v2', description: 'Production' },
    { url: '/api-tracking/v2', description: 'Relative to the host that serves the documentation' },
    { url: 'HTTPS://API.LOGISTICS.EXAMPLE.COM/api-tracking/v2', description: 'Uppercase scheme' },
    { url: 'ftp://files.logistics.example.com/exports', description: 'File drop' },
    { url: 'wss://stream.logistics.example.com/api-tracking/v2', description: 'Event stream' },
    { url: '{scheme}://api.logistics.example.com/api-tracking/v2', variables: { scheme: { default: 'https', enum: ['http', 'https'] } } },
    { url: 'https://{tenant}.logistics.example.com/api-tracking/v2', variables: { tenant: { enum: ['acme', 'globex'], description: 'Customer tenant' } } },
    { url: 'https://api.logistics.example.com:{port}/api-tracking/v2', variables: { port: { default: 8443 } } },
    { url: 'https://{region}.logistics.example.com/api-tracking/v2', description: 'Undeclared variable' },
    { url: 'https://api.logistics.example.com/api-tracking/v2', variables: { basePath: { description: 'Declared but unused, without default' } } },
    { description: 'Server without url' },
    { url: ' https://api.logistics.example.com/api-tracking/v2', description: 'Leading space' },
    { url: 'https://', description: 'Scheme only' },
    { url: 'http:///api-tracking/v2', description: 'Empty authority' },
    { url: 'https://api.logistics.example.com:70000/api-tracking/v2', description: 'Port out of range' },
    { url: 'https://api logistics.example.com/api-tracking/v2', description: 'Space in the host' },
    { url: 2 },
    'https://api.logistics.example.com/api-tracking/v2',
    null,
    { url: 'https://{env}.logistics.example.com', variables: { env: 'production' } },
  ],
  paths: {
    '/shipments': {
      summary: 'Shipments',
      servers: [{ url: '/api-tracking/v2', description: 'Relative path-level server' }],
      get: {
        operationId: 'listShipments',
        servers: [{ url: 'https://read.logistics.example.com/api-tracking/v2' }],
        responses,
      },
      post: {
        operationId: 'createShipment',
        servers: [{ url: 'shipments.logistics.example.com/api-tracking/v2', description: 'Missing scheme' }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Shipment' } } } },
        responses,
      },
    },
    '/shipments/{shipmentId}': {
      parameters: [shipmentId],
      get: { operationId: 'getShipment', responses },
      put: {
        operationId: 'replaceShipment',
        servers: [{ url: 'https://{zone}.logistics.example.com/api-tracking/v2', variables: { zone: { default: 'eu-west' } } }],
        responses,
      },
      patch: {
        operationId: 'updateShipment',
        servers: [{ url: 'https://{zone}.logistics.example.com/api-tracking/v2', variables: { zone: {} } }],
        responses,
      },
      delete: { operationId: 'cancelShipment', servers: [], responses },
      head: { operationId: 'checkShipment', servers: [{ url: '//cdn.logistics.example.com/api-tracking/v2' }], responses },
      options: { operationId: 'shipmentOptions', servers: [{ url: 'http://localhost:8080/api-tracking/v2' }], responses },
      trace: { operationId: 'traceShipment', servers: [{ url: 'file:///var/run/tracking.sock' }], responses },
      query: { operationId: 'notAnOperationIn30', servers: [{ url: '/query-is-only-an-operation-in-3-2' }], responses },
    },
    '/shipments/{shipmentId}/events': {
      parameters: [shipmentId],
      post: {
        operationId: 'subscribeShipmentEvents',
        responses,
        callbacks: {
          statusChanged: {
            '{$request.body#/callbackUrl}': {
              servers: [{ url: '/callbacks' }],
              post: { servers: [{ url: '/callbacks/status' }], responses },
            },
          },
        },
      },
    },
    '/carriers': {
      servers: { url: '/not-a-list' },
      get: { operationId: 'listCarriers', responses },
    },
    'x-internal': { servers: [{ url: '/internal' }] },
  },
  components: {
    schemas: {
      Shipment: {
        type: 'object',
        required: ['reference'],
        properties: {
          reference: { type: 'string' },
          carrier: { type: 'string', nullable: true },
          weightKg: { type: 'number', format: 'double' },
        },
      },
    },
  },
};
