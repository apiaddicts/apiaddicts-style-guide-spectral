const created = (schema) => ({
  description: 'Created',
  content: { 'application/json': { schema } },
});

const nullableObject = (properties) => ({ type: ['object', 'null'], properties });
const block = (name, properties) => ({ type: 'object', properties: { [name]: nullableObject(properties) } });

module.exports = {
  openapi: '3.1.0',
  jsonSchemaDialect: 'https://json-schema.org/draft/2020-12/schema',
  info: { version: '2.4.0', title: 'Billing API', license: { name: 'Apache 2.0', identifier: 'Apache-2.0' } },
  paths: {
    '/invoices': {
      post: {
        operationId: 'createInvoice',
        responses: {
          200: created(block('payload', { invoiceId: { type: 'string' } })),
          201: created({
            type: 'object',
            properties: {
              result: nullableObject({ code: { type: ['string', 'null'] }, message: { type: 'string' } }),
              data: nullableObject({ invoiceId: { type: 'string', format: 'uuid' } }),
              metadata: nullableObject({ apiVersion: { type: 'string' } }),
            },
          }),
        },
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
        responses: { 201: created({ $ref: '#/components/schemas/PaymentEnvelope', description: 'Payment created' }) },
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
  },
  webhooks: {
    invoicePaid: {
      post: {
        operationId: 'invoicePaidWebhook',
        responses: { 201: created(block('payload', { id: { type: 'string' } })) },
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
                data: nullableObject({ payoutId: { type: 'string' } }),
                metadata: nullableObject({ batch: { type: 'string' } }),
              },
            },
          },
        },
      },
    },
    schemas: {
      PaymentEnvelope: {
        allOf: [
          { $ref: '#/components/schemas/Envelopes/$defs/ResultBlock' },
          { type: 'object', properties: { data: { $ref: '#/components/schemas/PaymentData' } } },
        ],
      },
      Envelopes: {
        $defs: {
          ResultBlock: block('result', { code: { type: 'string' }, message: { type: 'string' } }),
        },
      },
      PaymentData: nullableObject({ paymentId: { type: 'string' } }),
    },
  },
};
