const object = (properties) => ({ type: 'object', properties });
const block = (name, properties) => object({ [name]: object(properties) });
const created = (schema) => ({ description: 'Created', schema });

module.exports = {
  swagger: '2.0',
  info: { version: '2.4.0', title: 'Billing API' },
  host: 'api.example.com',
  basePath: '/billing/v2',
  schemes: ['https'],
  produces: ['application/json'],
  paths: {
    '/invoices': {
      post: {
        operationId: 'createInvoice',
        responses: {
          200: created(block('payload', { invoiceId: { type: 'string' } })),
          201: created(object({
            result: object({ code: { type: 'string' }, message: { type: 'string' } }),
            data: object({ invoiceId: { type: 'string', format: 'uuid' } }),
            metadata: object({ apiVersion: { type: 'string' } }),
          })),
        },
      },
      put: {
        operationId: 'replaceInvoices',
        responses: { 201: created(block('payload', { batchId: { type: 'string' } })) },
      },
    },
    '/credit-notes': {
      post: {
        operationId: 'createCreditNote',
        responses: { 201: created(block('data', { creditNoteId: { type: 'string' } })) },
      },
    },
    '/payments': {
      post: {
        operationId: 'createPayment',
        responses: { 201: created({ $ref: '#/definitions/PaymentEnvelope' }) },
      },
    },
    '/payouts': {
      post: {
        operationId: 'createPayout',
        responses: { 201: { $ref: '#/responses/PayoutCreated' } },
      },
    },
    '/payouts/bulk': {
      post: {
        operationId: 'createPayouts',
        responses: { 201: { $ref: '#/responses/PayoutCreated' } },
      },
    },
    '/disputes': {
      post: {
        operationId: 'openDispute',
        responses: { 201: created({ $ref: '#/definitions/DisputeEnvelope' }) },
      },
    },
    '/receipts': {
      post: {
        operationId: 'createReceipt',
        responses: { 201: created(block('metadata', { apiVersion: { type: 'string' } })) },
      },
    },
    '/refunds': {
      post: {
        operationId: 'createRefund',
        responses: { 202: created(block('error', { code: { type: 'string' } })) },
      },
    },
  },
  responses: {
    PayoutCreated: {
      description: 'Payout scheduled',
      schema: object({
        data: object({ payoutId: { type: 'string' } }),
        metadata: object({ batch: { type: 'string' } }),
      }),
    },
  },
  definitions: {
    PaymentEnvelope: {
      allOf: [
        { $ref: '#/definitions/ResultBlock' },
        object({ data: { $ref: '#/definitions/PaymentData' } }),
      ],
    },
    ResultBlock: block('result', { code: { type: 'string' }, message: { type: 'string' } }),
    PaymentData: object({ paymentId: { type: 'string' } }),
    DisputeEnvelope: { $ref: '#/definitions/DisputeEnvelopeV2' },
    DisputeEnvelopeV2: object({
      data: object({ disputeId: { type: 'string' } }),
      result: object({ code: { type: 'string' } }),
    }),
  },
};
