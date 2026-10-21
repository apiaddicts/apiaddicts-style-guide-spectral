const created = (schema) => ({
  summary: 'Resource created',
  description: 'Created',
  content: { 'application/json': { schema } },
});

const object = (properties) => ({ type: 'object', properties });
const nullableObject = (properties) => ({ type: ['object', 'null'], properties });
const envelope = (dataProperties) => object({
  data: nullableObject(dataProperties),
  metadata: nullableObject({ apiVersion: { type: 'string' } }),
});

module.exports = {
  openapi: '3.2.0',
  info: { version: '1.8.0', title: 'Fulfillment API' },
  paths: {
    '/orders': {
      query: {
        operationId: 'searchOrders',
        responses: { 201: created(object({ items: nullableObject({ orderId: { type: 'string' } }) })) },
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
              { $ref: '#/components/schemas/ResponseMetadata', description: 'Shared metadata block' },
            ],
          }),
        },
      },
    },
    '/orders/{orderId}/notes': {
      $ref: '#/components/pathItems/OrderNotes',
    },
    '/bulk-orders': {
      post: {
        operationId: 'createBulkOrder',
        responses: {
          201: {
            summary: 'Batch created',
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
            data: nullableObject({ returnId: { type: 'string' } }),
            metadata: nullableObject({ apiVersion: { type: 'string' } }),
            error: nullableObject({ code: { type: 'string' } }),
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
  webhooks: {
    orderShipped: {
      post: {
        operationId: 'orderShippedWebhook',
        responses: { 201: created(object({ event: nullableObject({ orderId: { type: 'string' } }) })) },
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
            responses: { 201: created(object({ link: nullableObject({ href: { type: 'string' } }) })) },
          },
        },
        post: {
          operationId: 'addOrderNote',
          responses: { 201: { $ref: '#/components/responses/NoteCreated' } },
        },
      },
    },
    responses: {
      NoteCreated: {
        summary: 'Note created',
        description: 'Note created',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/NoteEnvelope' } } },
      },
    },
    schemas: {
      LabelData: object({ data: nullableObject({ labelId: { type: 'string' } }) }),
      ResponseMetadata: object({ metadata: nullableObject({ apiVersion: { type: 'string' } }) }),
      NoteEnvelope: { $ref: '#/components/schemas/NoteEnvelopeV2' },
      NoteEnvelopeV2: envelope({ noteId: { type: 'string' } }),
      ShipmentData: nullableObject({ shipmentId: { type: 'string' } }),
      MetadataBody: nullableObject({ apiVersion: { type: 'string' }, requestId: { type: 'string' } }),
    },
  },
};
