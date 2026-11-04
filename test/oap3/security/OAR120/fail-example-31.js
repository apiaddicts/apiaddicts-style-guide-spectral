const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Tracking API', summary: 'Shipment tracking for carriers and merchants.', version: '4.0.0' },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
  paths: {
    '/shipments': { $ref: '#/components/pathItems/Shipments' },
    '/carriers': { get: { operationId: 'listCarriers', security: [{ CarrierOAuth: [] }, { CarrierCertificate: [] }], responses: ok } },
  },
  webhooks: {
    shipmentDelivered: {
      post: {
        operationId: 'shipmentDelivered',
        security: [{ WebhookOAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { signedBy: { type: ['string', 'null'] } } } } },
        },
        responses: { 204: { description: 'Received' } },
      },
    },
  },
  components: {
    pathItems: {
      Shipments: { get: { operationId: 'listShipments', security: [{ ShipmentsOAuth: [] }], responses: ok } },
    },
    securitySchemes: {
      ShipmentsOAuth: {
        type: 'oauth2',
        flows: { password: { tokenUrl: 'https://auth.logistics.example.com/token?audience=shipments', scopes: {} } },
      },
      CarrierOAuth: { $ref: '#/components/securitySchemes/CarrierOAuthBase', description: 'Shared carrier server.' },
      CarrierOAuthBase: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://carriers/token', scopes: {} } } },
      CarrierCertificate: { type: 'mutualTLS' },
      WebhookOAuth: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'http://hooks.logistics.example.com/token', scopes: {} } } },
      OrphanOAuth: { type: 'oauth2', flows: { password: { tokenUrl: 'https://auth.logistics.example.com/oauth/access_token', scopes: {} } } },
    },
  },
};
