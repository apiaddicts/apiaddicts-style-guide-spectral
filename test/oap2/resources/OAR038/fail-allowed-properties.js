const object = (properties, extra = {}) => ({ type: 'object', properties, ...extra });

module.exports = {
  swagger: '2.0',
  info: { version: '2.4.0', title: 'Billing API' },
  host: 'api.example.com',
  basePath: '/billing/v2',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/invoices': {
      get: {
        operationId: 'listInvoices',
        responses: { 200: { description: 'OK', schema: object({ items: { type: 'array', items: { type: 'object' } } }) } },
      },
      post: {
        operationId: 'createInvoice',
        parameters: [{ name: 'body', in: 'body', required: true, schema: object({ amount: { type: 'number' } }) }],
        responses: {
          201: {
            description: 'Created',
            schema: object({
              result: object({ code: { type: 'string' }, message: { type: 'string' } }),
              data: object({ invoiceId: { type: 'string', format: 'uuid' }, total: { type: 'number' } }),
              metadata: object({ apiVersion: { type: 'string' }, requestId: { type: 'string' } }),
            }),
          },
          400: { description: 'Bad request', schema: object({ error: object({ code: { type: 'string' } }) }) },
        },
      },
    },
    '/credit-notes': {
      post: {
        operationId: 'createCreditNote',
        responses: { 201: { description: 'Created', schema: object({ data: object({ creditNoteId: { type: 'string' } }) }) } },
      },
    },
    '/refunds': {
      post: {
        operationId: 'createRefund',
        responses: {
          201: { description: 'Created', schema: object({ error: object({ code: { type: 'string' }, message: { type: 'string' } }) }) },
        },
      },
    },
    '/payments': {
      post: {
        operationId: 'createPayment',
        responses: { 201: { description: 'Created', schema: { $ref: '#/definitions/PaymentEnvelope' } } },
      },
    },
    '/payouts': {
      post: {
        operationId: 'createPayout',
        responses: {
          201: {
            description: 'Created',
            schema: object({
              data: object({ payoutId: { type: 'string' } }),
              links: object({ self: object({ href: { type: 'string' } }) }),
            }),
          },
        },
      },
      put: {
        operationId: 'replacePayout',
        responses: { 201: { description: 'Created', schema: object({ payload: { type: 'object' } }) } },
      },
    },
    '/receipts': {
      post: {
        operationId: 'createReceipt',
        responses: {
          201: {
            description: 'Created',
            schema: object({
              data: object({ receiptId: { type: 'string' } }),
              metadata: { type: 'object', description: 'Receipt metadata, free form' },
            }),
          },
        },
      },
    },
    '/disputes': {
      post: {
        operationId: 'openDispute',
        responses: { 201: { $ref: '#/responses/DisputeCreated' } },
      },
    },
    '/quotes': {
      post: {
        operationId: 'createQuote',
        responses: {
          201: { description: 'Created', schema: { type: 'object', additionalProperties: { type: 'string' } } },
        },
      },
    },
  },
  responses: {
    DisputeCreated: {
      description: 'Dispute opened',
      schema: { $ref: '#/definitions/DisputeEnvelope' },
    },
  },
  definitions: {
    PaymentEnvelope: {
      allOf: [
        { $ref: '#/definitions/ResultBlock' },
        object({ data: { $ref: '#/definitions/PaymentData' } }),
      ],
    },
    ResultBlock: object({ result: object({ code: { type: 'string' }, message: { type: 'string' } }) }),
    PaymentData: object({ paymentId: { type: 'string' }, status: { type: 'string' } }),
    DisputeEnvelope: object({
      data: object({ disputeId: { type: 'string' } }),
      result: object({ code: { type: 'string' } }),
    }),
  },
};
