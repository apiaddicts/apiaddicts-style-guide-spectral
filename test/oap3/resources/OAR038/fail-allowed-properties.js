const created = (schema) => ({
  description: 'Created',
  content: { 'application/json': { schema } },
});

const problem = {
  description: 'Bad request',
  content: {
    'application/json': {
      schema: { type: 'object', properties: { error: { type: 'object', properties: { code: { type: 'string' } } } } },
    },
  },
};

module.exports = {
  openapi: '3.0.3',
  info: { version: '2.4.0', title: 'Billing API' },
  servers: [{ url: 'https://api.example.com/billing/v2' }],
  paths: {
    '/invoices': {
      get: {
        operationId: 'listInvoices',
        responses: {
          200: created({ type: 'object', properties: { items: { type: 'array', items: { type: 'object' } } } }),
        },
      },
      post: {
        operationId: 'createInvoice',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { amount: { type: 'number' } } } } },
        },
        responses: {
          201: created({
            type: 'object',
            properties: {
              result: {
                type: 'object',
                properties: { code: { type: 'string' }, message: { type: 'string' } },
              },
              data: {
                type: 'object',
                properties: { invoiceId: { type: 'string', format: 'uuid' }, total: { type: 'number' } },
              },
              metadata: {
                type: 'object',
                properties: { apiVersion: { type: 'string' }, requestId: { type: 'string' } },
              },
            },
          }),
          400: problem,
        },
      },
    },
    '/credit-notes': {
      post: {
        operationId: 'createCreditNote',
        responses: {
          201: created({
            type: 'object',
            properties: {
              data: { type: 'object', properties: { creditNoteId: { type: 'string' } } },
            },
          }),
          400: problem,
        },
      },
    },
    '/refunds': {
      post: {
        operationId: 'createRefund',
        responses: {
          201: created({
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: { code: { type: 'string' }, message: { type: 'string' } },
              },
            },
          }),
        },
      },
    },
    '/payments': {
      post: {
        operationId: 'createPayment',
        responses: {
          201: created({ $ref: '#/components/schemas/PaymentEnvelope' }),
          400: problem,
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
              data: { type: 'object', properties: { payoutId: { type: 'string' } } },
              links: {
                type: 'object',
                properties: { self: { type: 'object', properties: { href: { type: 'string' } } } },
              },
            },
          }),
        },
      },
      put: {
        operationId: 'replacePayout',
        responses: {
          201: created({ type: 'object', properties: { payload: { type: 'object' } } }),
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
              data: { type: 'object', properties: { receiptId: { type: 'string' } } },
              metadata: { type: 'object', description: 'Receipt metadata, free form' },
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
                schema: {
                  type: 'object',
                  properties: { data: { type: 'object', properties: { disputeId: { type: 'string' } } } },
                },
              },
              'application/xml': {
                schema: {
                  type: 'object',
                  properties: { result: { type: 'object', properties: { code: { type: 'string' } } } },
                },
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
              { type: 'object', properties: { result: { type: 'object', properties: { code: { type: 'string' } } } } },
              { type: 'object', properties: { data: { type: 'object', properties: { quoteId: { type: 'string' } } } } },
            ],
          }),
        },
      },
    },
  },
  components: {
    schemas: {
      PaymentEnvelope: {
        allOf: [
          { $ref: '#/components/schemas/ResultBlock' },
          {
            type: 'object',
            properties: { data: { $ref: '#/components/schemas/PaymentData' } },
          },
        ],
      },
      ResultBlock: {
        type: 'object',
        properties: {
          result: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } },
        },
      },
      PaymentData: {
        type: 'object',
        properties: { paymentId: { type: 'string' }, status: { type: 'string' } },
      },
    },
  },
};
