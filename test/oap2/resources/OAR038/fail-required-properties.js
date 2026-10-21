const object = (properties, extra = {}) => ({ type: 'object', properties, ...extra });
const block = (name, properties) => object({ [name]: object(properties) });

module.exports = {
  swagger: '2.0',
  info: { version: '1.8.0', title: 'Fulfillment API' },
  basePath: '/fulfillment/v1',
  produces: ['application/json'],
  paths: {
    '/orders': {
      post: {
        operationId: 'createOrder',
        responses: {
          201: {
            description: 'Created',
            schema: object({
              data: object({ orderId: { type: 'string' }, status: { type: 'string' } }),
              metadata: object({ apiVersion: { type: 'string' } }),
            }),
          },
        },
      },
    },
    '/shipments': {
      post: {
        operationId: 'createShipment',
        responses: { 201: { description: 'Created', schema: block('data', { shipmentId: { type: 'string' } }) } },
      },
    },
    '/returns': {
      post: {
        operationId: 'createReturn',
        responses: { 201: { description: 'Created', schema: block('error', { code: { type: 'string' } }) } },
      },
    },
    '/labels': {
      post: {
        operationId: 'createLabel',
        responses: {
          201: {
            description: 'Created',
            schema: { allOf: [{ $ref: '#/definitions/LabelData' }, { $ref: '#/definitions/ResponseMetadata' }] },
          },
        },
      },
    },
    '/pickups': {
      post: {
        operationId: 'schedulePickup',
        responses: {
          201: {
            description: 'Created',
            schema: object({ data: object({ pickupId: { type: 'string' } }), metadata: { type: 'object' } }),
          },
        },
      },
    },
    '/manifests': {
      post: {
        operationId: 'createManifest',
        responses: {
          201: {
            description: 'Created',
            schema: object({
              data: object({ manifestId: { type: 'string' }, metadata: object({ apiVersion: { type: 'string' } }) }),
            }),
          },
        },
      },
    },
    '/customs-declarations': {
      post: {
        operationId: 'fileCustomsDeclaration',
        responses: { 201: { description: 'Created, no body' } },
      },
    },
    '/tracking-events': {
      post: {
        operationId: 'pushTrackingEvent',
        responses: { 201: { description: 'Created', schema: { type: 'object', properties: {} } } },
      },
    },
    '/bulk-orders': {
      post: {
        operationId: 'createBulkOrder',
        responses: { 201: { description: 'Created', schema: { $ref: '#/definitions/BulkEnvelope' } } },
      },
    },
    '/orders/{orderId}/notes': {
      parameters: [{ name: 'orderId', in: 'path', required: true, type: 'string' }],
      post: {
        operationId: 'addOrderNote',
        responses: { 201: { $ref: '#/responses/NoteCreated' } },
      },
    },
  },
  responses: {
    NoteCreated: { description: 'Note created', schema: { $ref: '#/definitions/NoteEnvelope' } },
  },
  definitions: {
    LabelData: block('data', { labelId: { type: 'string' } }),
    ResponseMetadata: block('metadata', { apiVersion: { type: 'string' } }),
    BulkEnvelope: { $ref: '#/definitions/BulkEnvelopeV2' },
    BulkEnvelopeV2: block('data', { batchId: { type: 'string' } }),
    NoteEnvelope: block('data', { noteId: { type: 'string' } }),
  },
};
