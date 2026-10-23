const object = (properties) => ({ type: 'object', properties });
const envelope = (dataProperties) => object({
  data: object(dataProperties),
  metadata: object({ apiVersion: { type: 'string' } }),
});
const created = (schema) => ({ description: 'Created', schema });

module.exports = {
  swagger: '2.0',
  info: { version: '1.8.0', title: 'Fulfillment API' },
  basePath: '/fulfillment/v1',
  produces: ['application/json'],
  paths: {
    '/orders': {
      post: {
        operationId: 'createOrder',
        responses: { 201: created(envelope({ orderId: { type: 'string' } })) },
      },
    },
    '/labels': {
      post: {
        operationId: 'createLabel',
        responses: {
          201: created({ allOf: [{ $ref: '#/definitions/LabelData' }, { $ref: '#/definitions/ResponseMetadata' }] }),
        },
      },
    },
    '/orders/{orderId}/notes': {
      parameters: [{ name: 'orderId', in: 'path', required: true, type: 'string' }],
      post: {
        operationId: 'addOrderNote',
        responses: { 201: { $ref: '#/responses/NoteCreated' } },
      },
    },
    '/bulk-orders': {
      post: {
        operationId: 'createBulkOrder',
        responses: { 201: created({ $ref: '#/definitions/BulkEnvelope' }) },
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
            data: { $ref: '#/definitions/ShipmentData' },
            metadata: { $ref: '#/definitions/MetadataBody' },
          })),
        },
      },
    },
  },
  responses: {
    NoteCreated: { description: 'Note created', schema: { $ref: '#/definitions/NoteEnvelope' } },
  },
  definitions: {
    LabelData: object({ data: object({ labelId: { type: 'string' } }) }),
    ResponseMetadata: object({ metadata: object({ apiVersion: { type: 'string' } }) }),
    NoteEnvelope: envelope({ noteId: { type: 'string' } }),
    BulkEnvelope: { $ref: '#/definitions/BulkEnvelopeV2' },
    BulkEnvelopeV2: envelope({ batchId: { type: 'string' } }),
    ShipmentData: object({ shipmentId: { type: 'string' } }),
    MetadataBody: object({ apiVersion: { type: 'string' }, requestId: { type: 'string' } }),
  },
};
