const json = (schema) => ({ 'application/json': { schema } });
const ok = { 200: { description: 'Ok', content: json({ type: 'object' }) } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Customer Onboarding API', version: '2.3.0' },
  servers: [{ url: 'https://api.onboarding.example.com/v2' }],
  paths: {
    '/customers': {
      parameters: [
        { $ref: '#/components/parameters/tenantHeaderParam' },
        { $ref: '#/components/parameters/correlationIdParam' },
      ],
      get: {
        operationId: 'getCustomers',
        parameters: [
          { $ref: '#/components/parameters/startParam' },
          { $ref: '#/components/parameters/limitParam' },
          { $ref: '#/components/parameters/totalParam' },
          { $ref: '#/components/parameters/onboardingStatusParam' },
          { name: 'q', in: 'query', schema: { type: 'string' } },
        ],
        responses: ok,
      },
      post: {
        operationId: 'createCustomer',
        parameters: [{ $ref: '#/components/parameters/idempotencyKeyParam' }],
        requestBody: { content: json({ $ref: '#/components/schemas/Customer' }) },
        responses: ok,
        callbacks: {
          onboardingCompleted: {
            '{$request.body#/callbackUrl}': {
              post: {
                parameters: [{ $ref: '#/components/parameters/signatureHeaderParam' }, { $ref: '#/components/parameters/deliveryIdParam' }],
                responses: ok,
              },
            },
            'x-retries': { post: { parameters: [{ $ref: '#/components/parameters/retryOnly' }] } },
          },
        },
      },
      'x-internal': { parameters: [{ $ref: '#/components/parameters/internalOnly' }] },
    },
    '/customers/{customerId}': {
      parameters: [{ $ref: '#/components/parameters/customerIdParam' }],
      get: { operationId: 'getCustomer', parameters: [{ $ref: '#/components/parameters/expandParam' }], responses: ok },
      put: { operationId: 'replaceCustomer', parameters: [{ $ref: '#/components/parameters/ifMatchParam' }], responses: ok },
      patch: { operationId: 'updateCustomer', parameters: [{ $ref: 'common.yaml#/components/parameters/ifMatchParam' }], responses: ok },
      delete: { operationId: 'deleteCustomer', parameters: [{ $ref: 'https://schemas.onboarding.example.com/common.yaml#/components/parameters/reasonParam' }], responses: ok },
      head: { operationId: 'checkCustomer', parameters: [{ $ref: '#/components/parameters/etagParam' }], responses: ok },
      options: { operationId: 'customerOptions', parameters: [{ $ref: '#/components/parameters/originParam' }], responses: ok },
      trace: { operationId: 'traceCustomer', parameters: [{ $ref: '#/components/parameters/traceContextParam' }], responses: ok },
    },
    '/customers/{customerId}/documents': {
      get: {
        operationId: 'listDocuments',
        parameters: [
          { $ref: '#/components/parameters/documentTypeParam' },
          { $ref: '#/components/parameters/sessionCookieParam' },
        ],
        responses: {
          200: {
            description: 'Documents',
            content: json({
              type: 'object',
              properties: {
                parameters: { type: 'array', items: { $ref: '#/components/schemas/Filter' } },
              },
            }),
            links: { getCustomer: { operationId: 'getCustomer', parameters: { customerId: '$response.body#/customerId' } } },
          },
        },
      },
      query: { operationId: 'searchDocuments', parameters: [{ $ref: '#/components/parameters/notAnOperation' }], responses: ok },
      additionalOperations: { COPY: { parameters: [{ $ref: '#/components/parameters/notAnOperation' }], responses: ok } },
    },
  },
  webhooks: {
    customerUpdated: { post: { parameters: [{ $ref: '#/components/parameters/webhookOnly' }], responses: ok } },
  },
  components: {
    schemas: {
      Customer: { type: 'object', properties: { name: { type: 'string' } } },
      Filter: { type: 'object', properties: { field: { type: 'string' } } },
    },
    parameters: {
      tenantHeaderParam: { name: 'X-Tenant-Id', in: 'header', required: true, schema: { type: 'string' } },
      correlationIdParam: { name: 'X-Correlation-Id', in: 'header', schema: { type: 'string' } },
      startParam: { name: '$start', in: 'query', schema: { type: 'integer' } },
      limitParam: { name: '$limit', in: 'query', schema: { type: 'integer' } },
      totalParam: { name: '$total', in: 'query', schema: { type: 'boolean' } },
      onboardingStatusParam: { name: 'onboarding_status', in: 'query', schema: { type: 'string' } },
      idempotencyKeyParam: { name: 'Idempotency-Key', in: 'header', schema: { type: 'string' } },
      signatureHeaderParam: { name: 'X-Signature', in: 'header', schema: { type: 'string' } },
      deliveryIdParam: { name: 'X-Delivery-Id', in: 'header', schema: { type: 'string' } },
      customerIdParam: { name: 'customerId', in: 'path', required: true, schema: { type: 'string' } },
      expandParam: { name: '$expand', in: 'query', schema: { type: 'string' } },
      ifMatchParam: { name: 'If-Match', in: 'header', schema: { type: 'string' } },
      etagParam: { name: 'If-None-Match', in: 'header', schema: { type: 'string' } },
      originParam: { name: 'Origin', in: 'header', schema: { type: 'string' } },
      traceContextParam: { name: 'traceparent', in: 'header', schema: { type: 'string' } },
      documentTypeParam: { name: 'documentType', in: 'query', schema: { type: 'string' } },
      sessionCookieParam: { name: 'session', in: 'cookie', schema: { type: 'string' } },
      pageSizeParam: { $ref: '#/components/parameters/limitParam' },
    },
    callbacks: {
      AuditEvent: {
        '{$request.body#/auditUrl}': {
          post: { parameters: [{ $ref: '#/components/parameters/auditSignatureParam' }], responses: ok },
        },
      },
    },
    pathItems: {
      Unchecked: { get: { parameters: [{ $ref: '#/components/parameters/pathItemOnly' }], responses: ok } },
    },
  },
};
