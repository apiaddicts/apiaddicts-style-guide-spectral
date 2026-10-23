const created = (schema) => ({
  description: 'Created',
  content: { 'application/json': { schema } },
});

const nullableObject = (properties, extra = {}) => ({ type: ['object', 'null'], properties, ...extra });

module.exports = {
  openapi: '3.1.0',
  jsonSchemaDialect: 'https://json-schema.org/draft/2020-12/schema',
  info: { version: '2.4.0', title: 'Billing API', license: { name: 'Apache 2.0', identifier: 'Apache-2.0' } },
  paths: {
    '/invoices': {
      post: {
        operationId: 'createInvoice',
        responses: {
          201: created({
            type: 'object',
            properties: {
              result: nullableObject({ code: { type: ['string', 'null'] }, message: { type: 'string' } }),
              data: nullableObject({ invoiceId: { type: 'string', format: 'uuid' }, total: { type: ['number', 'null'] } }),
              metadata: nullableObject({ apiVersion: { type: 'string' }, requestId: { type: 'string' } }),
            },
          }),
        },
      },
    },
    '/credit-notes': {
      post: {
        operationId: 'createCreditNote',
        responses: {
          201: created({
            type: ['object', 'null'],
            properties: { data: nullableObject({ creditNoteId: { type: 'string' } }) },
          }),
        },
      },
    },
    '/refunds': {
      post: {
        operationId: 'createRefund',
        responses: {
          201: created({
            type: 'object',
            properties: { error: nullableObject({ code: { type: 'string' }, message: { type: 'string' } }) },
          }),
        },
      },
    },
    '/payments': {
      post: {
        operationId: 'createPayment',
        responses: {
          201: created({ $ref: '#/components/schemas/PaymentEnvelope', description: 'Payment created' }),
        },
      },
    },
    '/payouts': {
      post: {
        operationId: 'createPayout',
        responses: {
          201: created({
            type: 'object',
            properties: {
              data: nullableObject({ payoutId: { type: 'string' } }),
              links: nullableObject({ self: { type: 'object', properties: { href: { type: 'string', format: 'uri' } } } }),
            },
          }),
        },
      },
    },
    '/receipts': {
      post: {
        operationId: 'createReceipt',
        responses: {
          201: created({
            type: 'object',
            properties: {
              data: nullableObject({ receiptId: { type: 'string' } }),
              metadata: { type: ['object', 'null'], description: 'Receipt metadata, free form' },
            },
          }),
        },
      },
    },
    '/disputes': {
      post: {
        operationId: 'openDispute',
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { data: nullableObject({ disputeId: { type: 'string' } }) } },
              },
              'application/xml': {
                schema: { type: 'object', properties: { result: nullableObject({ code: { type: 'string' } }) } },
              },
            },
          },
        },
      },
    },
    '/quotes': {
      post: {
        operationId: 'createQuote',
        responses: {
          201: created({
            oneOf: [
              { type: 'object', properties: { result: nullableObject({ code: { type: 'string' } }) } },
              { type: 'object', properties: { data: nullableObject({ quoteId: { type: 'string' } }) } },
            ],
          }),
        },
      },
    },
  },
  webhooks: {
    invoicePaid: {
      post: {
        operationId: 'invoicePaidWebhook',
        responses: {
          201: created({ type: 'object', properties: { payload: { type: 'object', properties: { id: { type: 'string' } } } } }),
        },
      },
    },
  },
  components: {
    schemas: {
      PaymentEnvelope: {
        allOf: [
          { $ref: '#/components/schemas/Envelopes/$defs/ResultBlock' },
          { type: 'object', properties: { data: { $ref: '#/components/schemas/PaymentData' } } },
        ],
      },
      Envelopes: {
        $defs: {
          ResultBlock: {
            type: 'object',
            properties: { result: nullableObject({ code: { type: 'string' }, message: { type: 'string' } }) },
          },
        },
      },
      PaymentData: nullableObject({ paymentId: { type: 'string' }, status: { type: 'string' } }),
    },
  },
};
