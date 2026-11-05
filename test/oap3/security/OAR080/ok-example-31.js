const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Shipments API', version: '3.0.0' },
  servers: [{ url: 'https://api.logistics.example.com/v3' }],
  security: [{ shipperOAuth: ['shipments:read'] }, { clientCertificate: [] }],
  paths: {
    '/shipments': {
      get: { operationId: 'listShipments', security: [{ shipperOAuth: ['shipments:write'] }], responses },
      post: { operationId: 'createShipment', security: [{ shipperOAuth: [], carrierKey: [] }], responses },
    },
    '/shipments/{shipmentId}': { $ref: '#/components/pathItems/Shipment', summary: 'One shipment' },
    '/carriers': {
      query: { operationId: 'queryCarriers', security: [{ undeclaredScheme: [] }], responses },
      additionalOperations: { LINK: { security: [{ undeclaredScheme: [] }] } },
    },
  },
  webhooks: {
    shipmentDelivered: { post: { operationId: 'shipmentDeliveredWebhook', security: [{ webhookSignature: [] }], responses } },
    shipmentDelayed: { post: { operationId: 'shipmentDelayedWebhook', responses } },
    shipmentUpdated: { $ref: '#/components/pathItems/ShipmentUpdated' },
    ghost: { $ref: '#/components/pathItems/Missing' },
  },
  components: {
    securitySchemes: {
      shipperOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://auth.logistics.example.com/token', scopes: { 'shipments:read': 'Read', 'shipments:write': 'Write' } } } },
      clientCertificate: { type: 'mutualTLS' },
      webhookSignature: { type: 'apiKey', in: 'header', name: 'X-Signature' },
      carrierKey: { type: 'apiKey', in: 'header', name: 'X-Carrier-Key' },
    },
    pathItems: {
      Shipment: {
        get: { operationId: 'getShipment', security: [{}, { clientCertificate: [] }], responses },
        delete: { operationId: 'cancelShipment', security: [], responses },
      },
      ShipmentUpdated: { post: { operationId: 'shipmentUpdatedWebhook', security: [{ webhookSignature: [] }], responses } },
      Unused: { get: { operationId: 'unused', security: [{ undeclaredScheme: [] }], responses } },
    },
  },
};
