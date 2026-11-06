const nullable = (type) => ({ type: [type, 'null'] });
const ok = { 200: { description: 'Ok', content: { 'application/json': { schema: { type: 'object' } } } } };

module.exports = {
  openapi: '3.1.0',
  info: { title: 'Logistics Shipment API', version: '4.0.0' },
  servers: [{ url: 'https://api.logistics.example.com/v4' }],
  paths: {
    '/shipments': {
      get: {
        operationId: 'listShipments',
        parameters: [
          { $ref: '#/components/parameters/shipmentStatusParam', summary: 'Status filter', description: 'Overrides the shared description.' },
          { $ref: '#/components/parameters/limitParam', description: 'Page size.' },
          { name: 'reference', in: 'query', schema: nullable('string') },
        ],
        responses: ok,
      },
    },
    '/labels': {
      $ref: '#/components/pathItems/Labels',
      parameters: [{ $ref: '#/components/parameters/printerHeaderParam' }],
      put: { operationId: 'replaceLabels', parameters: [{ $ref: '#/components/parameters/labelFormatParam' }], responses: ok },
    },
    '/shipments/{shipmentId}': { $ref: '#/components/pathItems/Shipment' },
    '/carriers': {
      get: { operationId: 'listCarriers', parameters: [{ $ref: '#/components/parameters/carrierCodeParam' }, { $ref: '#/components/parameters/carrierFilterParam' }], responses: ok },
      query: { operationId: 'searchCarriers', parameters: [{ $ref: '#/components/parameters/notAnOperation' }], responses: ok },
      additionalOperations: { COPY: { parameters: [{ $ref: '#/components/parameters/notAnOperation' }], responses: ok } },
    },
  },
  webhooks: {
    shipmentDelivered: { post: { operationId: 'shipmentDelivered', parameters: [{ $ref: '#/components/parameters/webhookSignatureParam' }], responses: ok } },
    shipmentUpdated: { $ref: '#/components/pathItems/ShipmentUpdated' },
  },
  components: {
    parameters: {
      shipmentStatusParam: { name: 'status', in: 'query', schema: nullable('string') },
      limitParam: { name: 'limit', in: 'query', schema: { type: ['integer', 'null'], minimum: 1 } },
      printerHeaderParam: { name: 'X-Printer-Id', in: 'header', schema: { type: 'string' } },
      labelFormatParam: { name: 'format', in: 'query', schema: { type: 'string', enum: ['pdf', 'zpl'] } },
      carrierCodeParam: { name: 'carrierCode', in: 'query', schema: nullable('string') },
      carrierFilterParam: { $ref: '#/components/parameters/carrierNameParam' },
      carrierNameParam: { name: 'carrier', in: 'query', schema: nullable('string') },
      webhookSignatureParam: { name: 'X-Webhook-Signature', in: 'header', required: true, schema: { type: 'string' } },
      labelSizeParam: { name: 'size', in: 'query', schema: { type: 'string' } },
      shipmentIdParam: { name: 'shipmentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      dispatcherHeaderParam: { name: 'X-Dispatcher', in: 'header', schema: { type: 'string' } },
    },
    pathItems: {
      Labels: { get: { operationId: 'listLabels', parameters: [{ $ref: '#/components/parameters/labelSizeParam' }], responses: ok } },
      Shipment: {
        parameters: [{ $ref: '#/components/parameters/shipmentIdParam' }],
        get: { operationId: 'getShipment', responses: ok },
        delete: { operationId: 'cancelShipment', parameters: [{ $ref: '#/components/parameters/dispatcherHeaderParam' }], responses: ok },
      },
      ShipmentUpdated: { post: { operationId: 'shipmentUpdated', parameters: [{ $ref: '#/components/parameters/webhookSignatureParam' }], responses: ok } },
      Unreferenced: { get: { operationId: 'unreferenced', parameters: [{ $ref: '#/components/parameters/limitParam' }], responses: ok } },
    },
  },
};
