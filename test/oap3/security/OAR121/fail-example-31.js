const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Tracking API', summary: 'Shipment tracking for carriers and merchants.', version: '4.0.0' },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
  paths: {
    '/shipments': { $ref: '#/components/pathItems/Shipments' },
    '/carriers': { get: { operationId: 'listCarriers', security: [{ CarrierBearer: [] }, { CarrierCertificate: [] }], responses: ok } },
  },
  webhooks: {
    shipmentDelivered: {
      post: {
        operationId: 'shipmentDelivered',
        security: [{ WebhookKey: [] }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { signedBy: { type: ['string', 'null'] } } } } },
        },
        responses: { 204: { description: 'Received' } },
      },
    },
  },
  components: {
    pathItems: {
      Shipments: { get: { operationId: 'listShipments', security: [{ ShipmentsBasic: [] }], responses: ok } },
    },
    securitySchemes: {
      ShipmentsBasic: { type: 'http', scheme: 'basic' },
      CarrierBearer: { $ref: '#/components/securitySchemes/CarrierBearerBase', description: 'Shared carrier token.' },
      CarrierBearerBase: { type: 'http', scheme: 'bearer' },
      CarrierCertificate: { type: 'mutualTLS', description: 'Carrier client certificate.' },
      WebhookKey: { type: 'apiKey', in: 'header', name: 'X-Webhook-Signature' },
      OrphanSso: { type: 'openIdConnect', openIdConnectUrl: 'https://sso.logistics.example.com/.well-known/openid-configuration' },
    },
  },
};
