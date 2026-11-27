const policy = { $ref: '#/definitions/Policy' };

module.exports = {
  swagger: '2.0',
  info: {
    title: 'Policy Administration API',
    version: '2.1.0',
    description: 'Issuance, endorsements and renewals of home insurance policies.',
  },
  host: 'api-insurance.example.com',
  basePath: '/policy-administration/v2',
  schemes: ['https'],
  tags: [{ name: 'Health' }, { name: 'Policies' }],
  paths: {
    '/status': {
      get: { tags: ['Health'], operationId: 'getStatus', responses: { 200: { description: 'The service is up' } } },
    },
    '/api-policies/v2/policies': {
      get: {
        tags: ['Policies'],
        operationId: 'listPolicies',
        responses: { 200: { description: 'Policies', schema: { type: 'array', items: policy } } },
      },
    },
    '/policies/{policyId}': {
      get: {
        tags: ['Policies'],
        operationId: 'getPolicy',
        parameters: [{ name: 'policyId', in: 'path', required: true, type: 'string' }],
        responses: { 200: { description: 'The policy', schema: policy } },
      },
    },
  },
  'x-gateway-base-path': '/api-policy-administration/v2',
  definitions: {
    Policy: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        holderId: { type: 'string' },
      },
    },
  },
};
