const responses = { 200: { description: 'Ok' }, default: { description: 'Unexpected error' } };
const shipmentId = { name: 'shipmentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Logistics Tracking API', version: '2.4.0', description: 'Tracks shipments, carriers and delivery events.' },
  servers: [
    { url: 'http://greetings-service:8080/api-greetings/v1', description: 'Upstream backend service' },
    { url: 'https://api.logistics.example.com/api-tracking/v2', description: 'Production' },
    {
      url: 'https://{region}.logistics.example.com:{port}/api-tracking/{version}',
      variables: {
        region: { default: 'eu', enum: ['eu', 'us'] },
        port: { default: '8443' },
        version: { default: 'v2' },
      },
    },
    { url: 'https://{host}', variables: { host: { default: 'api.logistics.example.com' } } },
    { url: 'http://localhost:3000' },
    { url: 'http://10.0.12.4:8080/api-tracking/v2' },
    { url: 'https://[2001:db8::10]:8443/api-tracking/v2' },
    { url: 'https://api.logistics.example.com/api-tracking/v2/' },
    { url: 'https://api.logistics.example.com/api-tracking/v2?tenant=acme' },
    { url: 'https://api.logistics.example.com', variables: {} },
    { url: 'https://api.logistics.example.com', 'x-adc-upstream-node-defaults': { weight: 50 } },
  ],
  paths: {
    '/shipments': {
      servers: [{ url: 'https://read.logistics.example.com/api-tracking/v2' }],
      get: { operationId: 'listShipments', responses },
      post: {
        operationId: 'createShipment',
        servers: [{ url: 'https://write.logistics.example.com/api-tracking/v2' }, { url: 'http://shipments-service:8080/api-tracking/v2' }],
        responses,
      },
    },
    '/shipments/{shipmentId}': {
      parameters: [shipmentId],
      get: { operationId: 'getShipment', responses },
      put: {
        operationId: 'replaceShipment',
        servers: [{ url: 'https://{zone}.logistics.example.com/api-tracking/v2', variables: { zone: { default: 'eu-west', enum: ['eu-west', 'us-east'] } } }],
        responses,
      },
      delete: { operationId: 'cancelShipment', servers: [], responses },
      head: { operationId: 'checkShipment', responses },
      options: { operationId: 'shipmentOptions', responses },
      trace: { operationId: 'traceShipment', servers: [{ url: 'http://localhost:8080/api-tracking/v2' }], responses },
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
              post: { servers: [{ url: 'callbacks.partner.example' }], responses },
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
        properties: {
          reference: { type: 'string' },
          carrier: { type: 'string', nullable: true },
        },
      },
    },
  },
};
