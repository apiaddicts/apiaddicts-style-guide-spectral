const created = (schema) => ({
  description: 'Created',
  content: { 'application/json': { schema } },
});

const object = (properties) => ({ type: 'object', properties });
const envelope = (dataProperties) => object({
  data: object(dataProperties),
  metadata: object({ apiVersion: { type: 'string' } }),
});

module.exports = {
  openapi: '3.0.3',
  info: { version: '1.8.0', title: 'Fulfillment API' },
  paths: {
    '/orders': {
      get: {
        operationId: 'listOrders',
        responses: { 200: created(object({ items: { type: 'array', items: { type: 'object' } } })) },
      },
      post: {
        operationId: 'createOrder',
        responses: { 201: created(envelope({ orderId: { type: 'string' } })) },
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
    '/orders/{orderId}/notes': {
      parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
      post: {
        operationId: 'addOrderNote',
        responses: { 201: { $ref: '#/components/responses/NoteCreated' } },
      },
    },
    '/bulk-orders': {
      post: {
        operationId: 'createBulkOrder',
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': { schema: envelope({ batchId: { type: 'string' } }) },
              'application/xml': { schema: envelope({ batchId: { type: 'string' } }) },
            },
          },
        },
      },
    },
    '/returns': {
      post: {
        operationId: 'createReturn',
        responses: {
          201: created(object({
            data: object({ returnId: { type: 'string' } }),
            metadata: object({ apiVersion: { type: 'string' } }),
            error: object({ code: { type: 'string' } }),
          })),
        },
      },
    },
    '/shipments': {
      post: {
        operationId: 'createShipment',
        responses: {
          201: created(object({
            data: { $ref: '#/components/schemas/ShipmentData' },
            metadata: { $ref: '#/components/schemas/MetadataBody' },
          })),
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
      LabelData: object({ data: object({ labelId: { type: 'string' } }) }),
      ResponseMetadata: object({ metadata: object({ apiVersion: { type: 'string' } }) }),
      NoteEnvelope: { $ref: '#/components/schemas/NoteEnvelopeV2' },
      NoteEnvelopeV2: envelope({ noteId: { type: 'string' } }),
      ShipmentData: object({ shipmentId: { type: 'string' } }),
      MetadataBody: object({ apiVersion: { type: 'string' }, requestId: { type: 'string' } }),
    },
  },
};
