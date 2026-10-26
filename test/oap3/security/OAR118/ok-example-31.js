module.exports = {
  openapi: '3.1.0',
  info: {
    title: 'Logistics Tracking API',
    summary: 'Shipment tracking for carriers and merchants.',
    version: '4.1.0',
  },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
  security: [{ MerchantOAuth: [] }],
  paths: {
    '/shipments': { $ref: '#/components/pathItems/Shipments' },
    '/carriers': {
      get: {
        operationId: 'listCarriers',
        security: [{ CarrierOAuth: [] }, { CarrierCertificate: [] }],
        responses: { 200: { description: 'Carriers' } },
      },
    },
  },
  webhooks: {
    shipmentDelivered: {
      post: {
        operationId: 'shipmentDelivered',
        security: [{ CarrierOAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { signedBy: { type: ['string', 'null'] } } },
            },
          },
        },
        responses: { 204: { description: 'Received' } },
      },
    },
  },
  components: {
    pathItems: {
      Shipments: {
        get: {
          operationId: 'listShipments',
          responses: { 200: { description: 'Shipments' } },
        },
      },
    },
    securitySchemes: {
      MerchantOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://auth.logistics.example.com/authorize',
            tokenUrl: 'https://auth.logistics.example.com/token',
            scopes: { 'shipments:read': 'Read shipments' },
          },
        },
      },
      CarrierOAuth: {
        $ref: '#/components/securitySchemes/CarrierOAuthBase',
        description: 'OAuth server shared by every carrier integration.',
      },
      CarrierOAuthBase: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://auth.logistics.example.com/token', scopes: {} } },
      },
      CarrierCertificate: { type: 'mutualTLS' },
    },
  },
};
