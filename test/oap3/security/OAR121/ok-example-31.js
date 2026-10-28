const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Tracking API', version: '4.1.0' },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
  security: [{ MerchantOAuth: [] }],
  paths: {
    '/shipments': { $ref: '#/components/pathItems/Shipments' },
    '/carriers': { get: { operationId: 'listCarriers', security: [{ CarrierBearer: [] }], responses: ok } },
  },
  webhooks: {
    shipmentDelivered: {
      post: {
        operationId: 'shipmentDelivered',
        security: [{ CarrierBearer: [] }],
        requestBody: { content: { 'application/json': { schema: { type: ['object', 'null'] } } } },
        responses: { 204: { description: 'Received' } },
      },
    },
  },
  components: {
    pathItems: {
      Shipments: { get: { operationId: 'listShipments', responses: ok } },
    },
    securitySchemes: {
      MerchantOAuth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://auth.logistics.example.com/oauth2/token', scopes: {} } },
      },
      CarrierBearer: { $ref: '#/components/securitySchemes/CarrierBearerBase', description: 'Shared carrier token.' },
      CarrierBearerBase: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
};
