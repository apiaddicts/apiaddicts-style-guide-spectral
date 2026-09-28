module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR066 large multi schema fixture',
  },
  paths: {
    '/orders': {
      post: {
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Order' } },
          },
        },
        responses: {
          201: { description: 'Created' },
        },
      },
      get: {
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Item' },
                },
              },
            },
          },
        },
      },
    },
    '/customers': {
      post: {
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Customer' } },
          },
        },
        responses: {
          201: { description: 'Created' },
        },
      },
    },
    '/payments': {
      post: {
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Payment' } },
          },
        },
        responses: {
          201: { description: 'Created' },
        },
      },
    },
    '/shipments/{id}': {
      get: {
        parameters: [
          {
            name: 'id', in: 'path', required: true, schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Shipment' } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Order: {
        type: 'object',
        properties: {
          order_id: { type: 'string' },
          orderDate: { type: 'string' },
          total_amount: { type: 'number' },
        },
      },
      Item: {
        type: 'object',
        properties: {
          item_id: { type: 'string' },
          unitPrice: { type: 'number' },
          quantity: { type: 'integer' },
        },
      },
      Customer: {
        type: 'object',
        properties: {
          customer_id: { type: 'string' },
          firstName: { type: 'string' },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                street_name: { type: 'string' },
                zipCode: { type: 'string' },
                city: { type: 'string' },
              },
            },
          },
        },
      },
      Payment: {
        type: 'object',
        properties: {
          payment_id: { type: 'string' },
          payment_method: { type: 'string' },
          amount_due: { type: 'number' },
        },
      },
      Shipment: {
        type: 'object',
        properties: {
          shipment_id: { type: 'string' },
          trackingNumber: { type: 'string' },
          carrier: { type: 'string' },
          tracking_events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                event_id: { type: 'string' },
                eventTime: { type: 'string' },
                location: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};
