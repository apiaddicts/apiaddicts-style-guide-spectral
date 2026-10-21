const created = (schema) => ({
  summary: 'Resource created',
  description: 'Created',
  content: { 'application/json': { schema } },
});

const block = (name, properties) => ({ type: ['object', 'null'], properties: { [name]: { type: ['object', 'null'], properties } } });

module.exports = {
  openapi: '3.2.0',
  info: { version: '1.8.0', title: 'Fulfillment API' },
  paths: {
    '/orders': {
      query: {
        operationId: 'searchOrders',
        responses: { 201: created(block('items', { orderId: { type: 'string' } })) },
      },
      post: {
        operationId: 'createOrder',
        responses: {
          201: created({
            type: 'object',
            properties: {
              data: { type: ['object', 'null'], properties: { orderId: { type: 'string' }, status: { type: ['string', 'null'] } } },
              metadata: { type: ['object', 'null'], properties: { apiVersion: { type: 'string' } } },
            },
          }),
        },
      },
    },
    '/shipments': {
      post: {
        operationId: 'createShipment',
        responses: {
          201: created(block('data', { shipmentId: { type: 'string' }, carrier: { type: 'string' } })),
        },
      },
    },
    '/returns': {
      post: {
        operationId: 'createReturn',
        responses: {
          201: created(block('error', { code: { type: 'string' }, message: { type: 'string' } })),
        },
      },
    },
    '/labels': {
      post: {
        operationId: 'createLabel',
        responses: {
          201: created({
            allOf: [
              { $ref: '#/components/schemas/LabelData' },
              { $ref: '#/components/schemas/ResponseMetadata', description: 'Shared metadata block' },
            ],
          }),
        },
      },
    },
    '/pickups': {
      post: {
        operationId: 'schedulePickup',
        responses: {
          201: created({
            type: 'object',
            properties: {
              data: { type: ['object', 'null'], properties: { pickupId: { type: 'string' } } },
              metadata: { type: ['object', 'null'] },
            },
          }),
        },
      },
    },
    '/manifests': {
      post: {
        operationId: 'createManifest',
        responses: {
          201: created({
            type: 'object',
            properties: { data: { type: ['object', 'null'], properties: { manifestId: { type: 'string' } } } },
            anyOf: [block('metadata', { apiVersion: { type: 'string' } })],
          }),
        },
      },
    },
    '/customs-declarations': {
      post: {
        operationId: 'fileCustomsDeclaration',
        responses: {
          201: { summary: 'Declaration filed', description: 'Created, no body' },
        },
      },
    },
    '/tracking-events': {
      post: {
        operationId: 'pushTrackingEvent',
        responses: {
          201: created({ type: ['object', 'null'], properties: {} }),
        },
      },
    },
    '/bulk-orders': {
      post: {
        operationId: 'createBulkOrder',
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: ['object', 'null'], properties: { batchId: { type: 'string' } } },
                    metadata: { type: ['object', 'null'], properties: { apiVersion: { type: 'string' } } },
                  },
                },
              },
              'application/xml': {
                schema: block('data', { batchId: { type: 'string' } }),
              },
            },
          },
        },
      },
    },
    '/orders/{orderId}/notes': {
      $ref: '#/components/pathItems/OrderNotes',
    },
  },
  webhooks: {
    orderShipped: {
      post: {
        operationId: 'orderShippedWebhook',
        responses: { 201: created(block('event', { orderId: { type: 'string' } })) },
      },
    },
  },
  components: {
    pathItems: {
      OrderNotes: {
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
        additionalOperations: {
          LINK: {
            operationId: 'linkOrderNote',
            responses: { 201: created(block('link', { href: { type: 'string' } })) },
          },
        },
        post: {
          operationId: 'addOrderNote',
          responses: {
            201: { $ref: '#/components/responses/NoteCreated' },
          },
        },
      },
    },
    responses: {
      NoteCreated: {
        description: 'Note created',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/NoteEnvelope' } } },
      },
    },
    schemas: {
      LabelData: block('data', { labelId: { type: 'string' }, format: { type: 'string' } }),
      ResponseMetadata: block('metadata', { apiVersion: { type: 'string' }, requestId: { type: 'string' } }),
      NoteEnvelope: block('data', { noteId: { type: 'string' }, text: { type: 'string' } }),
    },
  },
};
