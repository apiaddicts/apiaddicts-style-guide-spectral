const claimSchema = { $ref: '#/components/schemas/Claim' };

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Motor Claims API',
    version: '1.4.0',
    description: 'First notice of loss, claim tracking and settlement for motor policies.',
  },
  servers: [
    { url: 'https://claims.example.com/api-motor-claims/v1', description: 'Production' },
    { url: 'https://claims.example.com/motor-claims/v1', description: 'Legacy production without prefix' },
    { url: 'https://api-gateway.example.com/motor-claims/v1', description: 'Prefix only in the host' },
    { url: 'https://claims.example.com/v1/api-motor-claims', description: 'Prefix after the version' },
    { url: 'https://claims.example.com/gateway/api-motor-claims/v1', description: 'Prefix in a nested segment' },
    { url: 'https://claims.example.com/api-/v1', description: 'Prefix without a name' },
    { url: 'https://claims.example.com/API-motor-claims/v1', description: 'Uppercase prefix' },
    { url: 'https://claims.example.com/apimotor-claims/v1', description: 'Prefix without hyphen' },
    { url: 'https://claims.example.com/api_motor_claims/v1', description: 'Prefix with underscore' },
    { url: 'https://claims.example.com', description: 'No base path' },
    { url: 'https://claims.example.com/', description: 'Root base path' },
    {
      url: 'https://claims.example.com/{apiName}/v1',
      description: 'API name in a variable',
      variables: { apiName: { default: 'api-motor-claims' } },
    },
    { url: '', description: 'Empty URL' },
    { url: '/motor-claims/v1', description: 'Relative URL without prefix' },
    { url: 'https://claims.example.com//api-motor-claims/v1', description: 'Empty first segment' },
    { url: 'claims.example.com/api-motor-claims/v1', description: 'Host without scheme' },
    { url: 'https://claims.example.com/api-?tenant=eu', description: 'Prefix followed by a query' },
    { url: 'http://localhost:8080/api-motor-claims/v1', description: 'Local' },
  ],
  tags: [{ name: 'Claims' }, { name: 'Health' }],
  paths: {
    '/status': {
      get: {
        tags: ['Health'],
        operationId: 'getStatus',
        responses: { 200: { description: 'The service is up' } },
      },
    },
    '/claims': {
      servers: [{ url: 'https://claims-intake.example.com/intake/v1' }],
      get: {
        tags: ['Claims'],
        operationId: 'listClaims',
        parameters: [{ name: 'policyNumber', in: 'query', schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Claims of the policy',
            content: { 'application/json': { schema: { type: 'array', items: claimSchema } } },
          },
        },
      },
      post: {
        tags: ['Claims'],
        operationId: 'createClaim',
        servers: [{ url: 'https://fnol.example.com/first-notice/v1' }],
        requestBody: { content: { 'application/json': { schema: claimSchema } } },
        responses: {
          201: {
            description: 'Claim registered',
            links: {
              GetClaim: {
                operationId: 'getClaim',
                parameters: { claimId: '$response.body#/id' },
                server: { url: 'https://claims.example.com/claims/v1' },
              },
            },
          },
        },
        callbacks: {
          claimSettled: {
            '{$request.body#/callbackUrl}': {
              post: {
                servers: [{ url: 'https://partners.example.com/notifications/v1' }],
                requestBody: { content: { 'application/json': { schema: claimSchema } } },
                responses: { 204: { description: 'Acknowledged' } },
              },
            },
          },
        },
      },
    },
    '/claims/{claimId}': {
      get: {
        tags: ['Claims'],
        operationId: 'getClaim',
        parameters: [{ name: 'claimId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'The claim', content: { 'application/json': { schema: claimSchema } } },
          404: { description: 'Claim not found' },
        },
      },
    },
  },
  components: {
    schemas: {
      Claim: {
        type: 'object',
        required: ['id', 'policyNumber'],
        properties: {
          id: { type: 'string' },
          policyNumber: { type: 'string' },
          status: { type: 'string', enum: ['open', 'in-review', 'settled', 'rejected'] },
          callbackUrl: { type: 'string', format: 'uri' },
        },
      },
    },
  },
};
