const json = (schema) => ({ 'application/json': { schema } });
const ok = { 200: { description: 'Ok', content: json({ type: 'object' }) } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Customer Onboarding API', version: '2.3.0' },
  servers: [{ url: 'https://api.onboarding.example.com/v2' }],
  paths: {
    '/customers': {
      parameters: [
        { $ref: '#/components/parameters/tenantHeader' },
        { $ref: '#/components/parameters/correlationIdParam' },
      ],
      get: {
        operationId: 'getCustomers',
        parameters: [
          { $ref: '#/components/parameters/startSlate' },
          { $ref: '#/components/parameters/limitParam' },
          { $ref: '#/components/parameters/totalParam' },
          { $ref: '#/components/parameters/onboardingStatusParam' },
          { name: 'q', in: 'query', schema: { type: 'string' } },
        ],
        responses: ok,
      },
      post: {
        operationId: 'createCustomer',
        parameters: [{ $ref: '#/components/parameters/idempotencyKey' }],
        requestBody: { content: json({ $ref: '#/components/schemas/Customer' }) },
        responses: ok,
        callbacks: {
          onboardingCompleted: {
            '{$request.body#/callbackUrl}': {
              post: {
                parameters: [{ $ref: '#/components/parameters/signatureHeader' }, { $ref: '#/components/parameters/deliveryIdParam' }],
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
      parameters: [{ $ref: '#/components/parameters/customerId' }],
      get: { operationId: 'getCustomer', parameters: [{ $ref: '#/components/parameters/expandParam' }], responses: ok },
      put: { operationId: 'replaceCustomer', parameters: [{ $ref: '#/components/parameters/ifMatch' }], responses: ok },
      patch: { operationId: 'updateCustomer', parameters: [{ $ref: 'common.yaml#/components/parameters/ifMatchParam' }], responses: ok },
      delete: { operationId: 'deleteCustomer', parameters: [{ $ref: 'common.yaml#/components/parameters/reason' }], responses: ok },
      head: { operationId: 'checkCustomer', parameters: [{ $ref: '#/components/parameters/etagParam' }], responses: ok },
      options: { operationId: 'customerOptions', parameters: [{ $ref: '#/components/parameters/originParam' }], responses: ok },
      trace: { operationId: 'traceCustomer', parameters: [{ $ref: '#/components/parameters/traceContext' }], responses: ok },
    },
    '/customers/{customerId}/documents': {
      get: {
        operationId: 'listDocuments',
        parameters: [
          { $ref: '#/components/parameters/documentType' },
          { $ref: '#/components/parameters/sessionCookie' },
          { $ref: './parameters/acceptLanguageParam.yaml' },
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
      tenantHeader: { name: 'X-Tenant-Id', in: 'header', required: true, schema: { type: 'string' } },
      correlationIdParam: { name: 'X-Correlation-Id', in: 'header', schema: { type: 'string' } },
      startSlate: { name: '$start', in: 'query', schema: { type: 'integer' } },
      limitParam: { name: '$limit', in: 'query', schema: { type: 'integer' } },
      totalParam: { name: '$total', in: 'query', schema: { type: 'boolean' } },
      onboardingStatusParam: { name: 'onboarding_status', in: 'query', schema: { type: 'string' } },
      idempotencyKey: { name: 'Idempotency-Key', in: 'header', schema: { type: 'string' } },
      signatureHeader: { name: 'X-Signature', in: 'header', schema: { type: 'string' } },
      deliveryIdParam: { name: 'X-Delivery-Id', in: 'header', schema: { type: 'string' } },
      customerId: { name: 'customerId', in: 'path', required: true, schema: { type: 'string' } },
      expandParam: { name: '$expand', in: 'query', schema: { type: 'string' } },
      ifMatch: { name: 'If-Match', in: 'header', schema: { type: 'string' } },
      etagParam: { name: 'If-None-Match', in: 'header', schema: { type: 'string' } },
      originParam: { name: 'Origin', in: 'header', schema: { type: 'string' } },
      traceContext: { name: 'traceparent', in: 'header', schema: { type: 'string' } },
      documentType: { name: 'documentType', in: 'query', schema: { type: 'string' } },
      sessionCookie: { name: 'session', in: 'cookie', schema: { type: 'string' } },
      pageSizeParam: { $ref: '#/components/parameters/limitParam' },
      pageAlias: { $ref: '#/components/parameters/pageSize' },
      pageSize: { name: 'pageSize', in: 'query', schema: { type: 'integer' } },
    },
    callbacks: {
      AuditEvent: {
        '{$request.body#/auditUrl}': {
          post: { parameters: [{ $ref: '#/components/parameters/auditSignature' }], responses: ok },
        },
      },
    },
    pathItems: {
      Unchecked: { get: { parameters: [{ $ref: '#/components/parameters/pathItemOnly' }], responses: ok } },
    },
  },
};
