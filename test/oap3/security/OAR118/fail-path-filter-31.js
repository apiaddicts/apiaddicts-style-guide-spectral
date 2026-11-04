const ok = { 200: { description: 'Ok' } };
const implicitFlow = { authorizationUrl: 'https://auth.logistics.example.com/authorize', scopes: {} };
const passwordFlow = { tokenUrl: 'https://auth.logistics.example.com/token', scopes: {} };
const oauth = (flows) => ({ type: 'oauth2', flows });

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Tracking API', version: '4.2.0' },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
  paths: {
    '/shipments': { get: { operationId: 'listShipments', security: [{ ShipmentsOAuth: [] }], responses: ok } },
    '/shipments/{shipmentId}/events': {
      parameters: [{ name: 'shipmentId', in: 'path', required: true, schema: { type: 'string' } }],
      get: { operationId: 'listShipmentEvents', security: [{ EventsOAuth: [] }], responses: ok },
    },
    '/carriers': { get: { operationId: 'listCarriers', security: [{ CarriersOAuth: [] }], responses: ok } },
  },
  webhooks: {
    trackingUpdated: { post: { operationId: 'trackingUpdated', security: [{ WebhookOAuth: [] }], responses: ok } },
  },
  components: {
    securitySchemes: {
      ShipmentsOAuth: oauth({ implicit: implicitFlow }),
      EventsOAuth: oauth({ password: passwordFlow }),
      CarriersOAuth: oauth({ implicit: implicitFlow }),
      WebhookOAuth: oauth({ password: passwordFlow }),
      UnusedOAuth: oauth({ implicit: implicitFlow }),
    },
  },
};
