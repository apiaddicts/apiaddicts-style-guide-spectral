const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Shipments API', version: '3.0.0' },
  servers: [{ url: 'https://api.logistics.example.com/v3' }],
  security: [{ shipperOAuth: ['shipments:read'] }, { clientCertificate: [] }],
  paths: {
    '/shipments': {
      get: { operationId: 'listShipments', security: [{ shipperOAuth: [] }], responses },
      post: { operationId: 'createShipment', security: [{ carrierKey: [] }], responses },
    },
    '/shipments/{shipmentId}': { $ref: '#/components/pathItems/Shipment', summary: 'One shipment' },
    '/carriers/{carrierId}/shipments/{shipmentId}': { $ref: '#/components/pathItems/Shipment' },
    '/labels': {
      $ref: '#/components/pathItems/Labels',
      description: 'Label printing',
      put: { operationId: 'replaceLabel', security: [{ printerKey: [] }], responses },
    },
    '/carriers': {
      get: { operationId: 'listCarriers', security: [{ '#/components/securitySchemes/carrierKey': [] }], responses },
    },
  },
  webhooks: {
    shipmentDelivered: {
      post: { operationId: 'shipmentDeliveredWebhook', security: [{ webhookSignature: [] }], responses },
    },
    shipmentDelayed: {
      post: { operationId: 'shipmentDelayedWebhook', responses },
    },
    shipmentUpdated: { $ref: '#/components/pathItems/ShipmentUpdated' },
  },
  components: {
    securitySchemes: {
      shipperOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://auth.logistics.example.com/token', scopes: { 'shipments:read': 'Read' } } } },
      clientCertificate: { type: 'mutualTLS' },
      carrierKey: { type: 'apiKey', in: 'header', name: 'X-Carrier-Key' },
    },
    pathItems: {
      Shipment: {
        get: { operationId: 'getShipment', security: [{ clientCertificate: [] }], responses },
        delete: { operationId: 'cancelShipment', security: [{ shipperOAuth: [], dispatcherKey: [] }], responses },
      },
      Labels: { get: { operationId: 'getLabel', security: [{ printerKey: [] }], responses } },
      ShipmentUpdated: { post: { operationId: 'shipmentUpdatedWebhook', security: [{ webhookSignature: [] }], responses } },
      Unused: { get: { operationId: 'unused', security: [{ undeclaredScheme: [] }], responses } },
    },
  },
};
