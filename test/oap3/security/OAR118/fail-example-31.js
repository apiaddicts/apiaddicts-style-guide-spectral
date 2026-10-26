module.exports = {
  openapi: '3.1.0',
  info: {
    title: 'Logistics Tracking API',
    summary: 'Shipment tracking for carriers and merchants.',
    version: '4.0.0',
    license: { name: 'Apache 2.0', identifier: 'Apache-2.0' },
  },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
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
        security: [{ WebhookOAuth: ['webhooks:send'] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  shipmentId: { type: 'string' },
                  signedBy: { type: ['string', 'null'] },
                  deliveredAt: { type: 'string', format: 'date-time' },
                },
              },
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
          security: [{ ShipmentsOAuth: ['shipments:read'] }],
          responses: {
            200: {
              description: 'Shipments',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { type: ['object', 'null'], properties: { id: { type: 'string' } } } },
                },
              },
            },
          },
        },
      },
      OrphanReturns: {
        post: {
          operationId: 'createReturn',
          security: [{ OrphanOAuth: [] }],
          responses: { 201: { description: 'Return created' } },
        },
      },
    },
    securitySchemes: {
      ShipmentsOAuth: {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'https://auth.logistics.example.com/authorize',
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
        flows: {
          implicit: { authorizationUrl: 'https://auth.logistics.example.com/authorize', scopes: {} },
          clientCredentials: { tokenUrl: 'https://auth.logistics.example.com/token', scopes: {} },
        },
      },
      CarrierCertificate: { type: 'mutualTLS', description: 'Carrier client certificate.' },
      WebhookOAuth: {
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: 'https://auth.logistics.example.com/token',
            scopes: { 'webhooks:send': 'Send webhooks' },
          },
        },
      },
      OrphanOAuth: {
        type: 'oauth2',
        flows: { password: { tokenUrl: 'https://auth.logistics.example.com/token', scopes: {} } },
      },
    },
  },
};
