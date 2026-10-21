const created = (schema) => ({
  description: 'Created',
  content: { 'application/json': { schema } },
});

const block = (name, properties) => ({ type: 'object', properties: { [name]: { type: 'object', properties } } });

module.exports = {
  openapi: '3.0.3',
  info: { version: '1.8.0', title: 'Fulfillment API' },
  paths: {
    '/orders': {
      post: {
        operationId: 'createOrder',
        responses: {
          201: created({
            type: 'object',
            properties: {
              data: { type: 'object', properties: { orderId: { type: 'string' }, status: { type: 'string' } } },
              metadata: { type: 'object', properties: { apiVersion: { type: 'string' } } },
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
              { $ref: '#/components/schemas/ResponseMetadata' },
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
              data: { type: 'object', properties: { pickupId: { type: 'string' } } },
              metadata: { type: 'object' },
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
            properties: { data: { type: 'object', properties: { manifestId: { type: 'string' } } } },
            oneOf: [block('metadata', { apiVersion: { type: 'string' } })],
          }),
        },
      },
    },
    '/customs-declarations': {
      post: {
        operationId: 'fileCustomsDeclaration',
        responses: {
          201: { description: 'Created, no body' },
        },
      },
    },
    '/tracking-events': {
      post: {
        operationId: 'pushTrackingEvent',
        responses: {
          201: created({ type: 'object', properties: {} }),
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
                    data: { type: 'object', properties: { batchId: { type: 'string' } } },
                    metadata: { type: 'object', properties: { apiVersion: { type: 'string' } } },
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
      parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
      post: {
        operationId: 'addOrderNote',
        responses: {
          201: { $ref: '#/components/responses/NoteCreated' },
        },
      },
    },
  },
  components: {
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
