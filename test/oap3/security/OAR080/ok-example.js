const responses = { 200: { description: 'Ok' }, 401: { description: 'Unauthorized' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Payments Gateway API', version: '2.4.0' },
  servers: [{ url: 'https://api.payments.example.com/v2' }],
  security: [{ merchantKey: [] }, { merchantOAuth: ['payments:read'] }, {}],
  paths: {
    '/payments': {
      get: { operationId: 'listPayments', security: [{ merchantKey: [] }], responses },
      post: { operationId: 'createPayment', security: [{ merchantOAuth: ['payments:write', 'payments:read'] }], responses },
    },
    '/payments/{paymentId}': {
      get: { operationId: 'getPayment', responses },
      put: { operationId: 'replacePayment', security: [{ merchantKey: [], partnerBasic: [] }], responses },
      patch: { operationId: 'updatePayment', security: [{}, { gatewayToken: [] }], responses },
      delete: { operationId: 'cancelPayment', security: [], responses },
      head: { operationId: 'checkPayment', security: [{}], responses },
      options: { operationId: 'paymentOptions', security: 'undeclaredScheme', responses },
      trace: { operationId: 'tracePayment', security: ['undeclaredScheme', null, 7, [{ undeclaredScheme: [] }]], responses },
    },
    '/payments/{paymentId}/refunds': {
      post: {
        operationId: 'refundPayment',
        security: [{ gatewayToken: [] }],
        responses,
        callbacks: {
          refundSettled: {
            '{$request.body#/callbackUrl}': {
              post: { operationId: 'refundSettledCallback', security: [{ partnerBasic: [] }], responses },
            },
            'x-retry-policy': { post: { security: [{ undeclaredScheme: [] }] } },
          },
          notifier: 'not a callback',
        },
      },
    },
    '/health': { get: { operationId: 'health', security: [], responses } },
    '/broken': null,
    'x-internal-routes': { '/admin': { get: { security: [{ undeclaredScheme: [] }] } } },
  },
  components: {
    securitySchemes: {
      merchantKey: { type: 'apiKey', in: 'header', name: 'X-Merchant-Key' },
      merchantOAuth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://auth.payments.example.com/token', scopes: { 'payments:read': 'Read', 'payments:write': 'Write' } } },
      },
      partnerBasic: { type: 'http', scheme: 'basic' },
      gatewayToken: { $ref: '#/x-shared-security/GatewayToken' },
    },
    callbacks: {
      UnusedCallback: { '{$request.body#/url}': { post: { security: [{ undeclaredScheme: [] }], responses } } },
    },
  },
  'x-shared-security': { GatewayToken: { type: 'http', scheme: 'bearer' } },
};
