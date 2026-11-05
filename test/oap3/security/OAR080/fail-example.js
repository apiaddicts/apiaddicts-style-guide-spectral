const responses = { 200: { description: 'Ok' }, 401: { description: 'Unauthorized' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Payments Gateway API', version: '2.4.0' },
  servers: [{ url: 'https://api.payments.example.com/v2' }],
  security: [{ merchantKey: [] }, { merchantOAuth: ['payments:read'] }, { gatewayToken: [] }],
  paths: {
    '/payments': {
      get: { operationId: 'listPayments', security: [{ merchantKey: [] }], responses },
      post: { operationId: 'createPayment', security: [{ merchantOAuth: ['payments:write'] }], responses },
    },
    '/payments/{paymentId}': {
      get: { operationId: 'getPayment', responses },
      put: { operationId: 'replacePayment', security: [{ merchantKey: [], partnerBasic: [], auditKey: [] }], responses },
      patch: { operationId: 'updatePayment', security: [{ MerchantKey: [] }], responses },
      delete: { operationId: 'cancelPayment', security: [{}, { adminBearer: [] }], responses },
      head: { operationId: 'checkPayment', security: [{ legacyKey: [] }], responses },
      options: { operationId: 'paymentOptions', security: [], responses },
      trace: { operationId: 'tracePayment', security: [{ undeclaredScheme: [] }], responses },
    },
    '/payments/{paymentId}/captures': {
      post: { operationId: 'capturePayment', security: [{ '#/components/securitySchemes/merchantKey': [] }], responses },
    },
    '/payments/{paymentId}/refunds': {
      post: {
        operationId: 'refundPayment',
        security: [{ merchantOAuth: ['payments:refund'] }],
        responses,
        callbacks: {
          refundSettled: {
            '{$request.body#/callbackUrl}': {
              post: { operationId: 'refundSettledCallback', security: [{ signatureKey: [] }], responses },
              put: { operationId: 'refundUpdatedCallback', security: [{ partnerBasic: [] }], responses },
            },
            'x-retry-policy': { post: { security: [{ ignoredKey: [] }] } },
          },
        },
      },
    },
    'x-internal-routes': { '/admin': { get: { security: [{ ignoredKey: [] }] } } },
  },
  components: {
    securitySchemes: {
      merchantKey: { type: 'apiKey', in: 'header', name: 'X-Merchant-Key' },
      merchantOAuth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://auth.payments.example.com/token', scopes: { 'payments:read': 'Read', 'payments:write': 'Write', 'payments:refund': 'Refund' } } },
      },
      partnerBasic: { type: 'http', scheme: 'basic' },
    },
  },
};
