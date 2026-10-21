const created = (schema) => ({
  description: 'Created',
  content: { 'application/json': { schema } },
});

const block = (name, properties) => ({ type: 'object', properties: { [name]: { type: 'object', properties } } });

module.exports = {
  openapi: '3.0.3',
  info: { version: '2.4.0', title: 'Billing API' },
  servers: [{ url: 'https://api.example.com/billing/v2' }],
  paths: {
    '/invoices': {
      post: {
        operationId: 'createInvoice',
        responses: {
          200: created(block('payload', { invoiceId: { type: 'string' } })),
          201: created({
            type: 'object',
            properties: {
              result: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } },
              data: { type: 'object', properties: { invoiceId: { type: 'string', format: 'uuid' } } },
              metadata: { type: 'object', properties: { apiVersion: { type: 'string' } } },
            },
          }),
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
        responses: { 201: created({ $ref: '#/components/schemas/PaymentEnvelope' }) },
      },
    },
    '/payouts': {
      post: {
        operationId: 'createPayout',
        responses: { 201: { $ref: '#/components/responses/PayoutCreated' } },
      },
    },
    '/payouts/bulk': {
      post: {
        operationId: 'createPayouts',
        responses: { 201: { $ref: '#/components/responses/PayoutCreated' } },
      },
    },
    '/disputes': {
      post: {
        operationId: 'openDispute',
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': { schema: block('data', { disputeId: { type: 'string' } }) },
              'application/xml': { schema: block('result', { code: { type: 'string' } }) },
            },
          },
        },
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
  components: {
    responses: {
      PayoutCreated: {
        description: 'Payout scheduled',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: { type: 'object', properties: { payoutId: { type: 'string' } } },
                metadata: { type: 'object', properties: { batch: { type: 'string' } } },
              },
            },
          },
        },
      },
    },
    schemas: {
      PaymentEnvelope: {
        allOf: [
          { $ref: '#/components/schemas/ResultBlock' },
          { type: 'object', properties: { data: { $ref: '#/components/schemas/PaymentData' } } },
        ],
      },
      ResultBlock: block('result', { code: { type: 'string' }, message: { type: 'string' } }),
      PaymentData: { type: 'object', properties: { paymentId: { type: 'string' } } },
    },
  },
};
