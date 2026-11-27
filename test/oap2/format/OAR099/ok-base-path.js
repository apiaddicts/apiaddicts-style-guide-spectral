const policy = { $ref: '#/definitions/Policy' };

module.exports = {
  swagger: '2.0',
  info: {
    title: 'Policy Administration API',
    version: '2.1.0',
    description: 'Issuance, endorsements and renewals of home insurance policies.',
  },
  host: 'insurance.example.com',
  basePath: '/api-policy-administration/v2',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    apiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
  },
  security: [{ apiKeyAuth: [] }],
  tags: [{ name: 'Health' }, { name: 'Policies' }, { name: 'Endorsements' }],
  paths: {
    '/status': {
      get: {
        tags: ['Health'],
        operationId: 'getStatus',
        security: [],
        responses: { 200: { description: 'The service is up' } },
      },
    },
    '/health/live': {
      get: { tags: ['Health'], operationId: 'getLiveness', responses: { 200: { description: 'Alive' } } },
    },
    '/policies': {
      get: {
        tags: ['Policies'],
        operationId: 'listPolicies',
        parameters: [
          { name: 'holderId', in: 'query', type: 'string' },
          { $ref: '#/parameters/limitParam' },
        ],
        responses: { 200: { description: 'Policies', schema: { type: 'array', items: policy } } },
      },
      post: {
        tags: ['Policies'],
        operationId: 'issuePolicy',
        parameters: [{ name: 'body', in: 'body', required: true, schema: policy }],
        responses: { 201: { description: 'Issued', schema: policy } },
      },
    },
    '/policies/{policyId}': {
      $ref: '#/x-path-items/PolicyById',
    },
    '/policies/{policyId}/endorsements': {
      get: {
        tags: ['Endorsements'],
        operationId: 'listEndorsements',
        parameters: [{ name: 'policyId', in: 'path', required: true, type: 'string' }],
        responses: { 200: { description: 'Endorsements of the policy' } },
      },
    },
    '/v2/legacy/policies': {
      get: {
        tags: ['Policies'],
        operationId: 'listLegacyPolicies',
        deprecated: true,
        responses: { 200: { description: 'Legacy listing' } },
      },
    },
  },
  'x-path-items': {
    PolicyById: {
      get: {
        tags: ['Policies'],
        operationId: 'getPolicy',
        parameters: [{ name: 'policyId', in: 'path', required: true, type: 'string' }],
        responses: { 200: { description: 'The policy', schema: policy }, 404: { description: 'Not found' } },
      },
    },
  },
  'x-legacy-base-path': '/policy-administration/v1',
  parameters: {
    limitParam: { name: 'limit', in: 'query', type: 'integer', minimum: 1, maximum: 100 },
  },
  definitions: {
    Policy: {
      type: 'object',
      required: ['id', 'holderId'],
      properties: {
        id: { type: 'string' },
        holderId: { type: 'string' },
        premium: { type: 'number', format: 'double' },
        documentsUrl: { type: 'string', format: 'uri', example: 'https://insurance.example.com/documents/v1' },
        'x-nullable-note': { type: 'string', 'x-nullable': true },
      },
    },
  },
};
