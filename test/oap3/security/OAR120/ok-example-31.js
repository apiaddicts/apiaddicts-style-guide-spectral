const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Tracking API', version: '4.1.0' },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
  security: [{ MerchantOAuth: [] }],
  paths: {
    '/shipments': { $ref: '#/components/pathItems/Shipments' },
    '/carriers': { get: { operationId: 'listCarriers', security: [{ CarrierOAuth: [] }, { CarrierCertificate: [] }], responses: ok } },
  },
  webhooks: {
    shipmentDelivered: { post: { operationId: 'shipmentDelivered', security: [{ CarrierOAuth: [] }], responses: { 204: { description: 'Received' } } } },
  },
  components: {
    pathItems: {
      Shipments: { get: { operationId: 'listShipments', responses: ok } },
    },
    securitySchemes: {
      MerchantOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://auth.logistics.example.com/oauth2/authorize',
            tokenUrl: 'https://auth.logistics.example.com/oauth2/token',
            scopes: {},
          },
        },
      },
      CarrierOAuth: { $ref: '#/components/securitySchemes/CarrierOAuthBase', description: 'Shared carrier server.' },
      CarrierOAuthBase: { type: 'oauth2', flows: { clientCredentials: { tokenUrl: 'https://carriers.logistics.example.com/token', scopes: {} } } },
      CarrierCertificate: { type: 'mutualTLS' },
    },
  },
};
