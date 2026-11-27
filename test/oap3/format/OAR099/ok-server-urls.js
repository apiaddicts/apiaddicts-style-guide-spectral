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
    { url: 'https://claims.example.com/api-motor-claims', description: 'Without version segment' },
    { url: 'https://claims.example.com/api-motor-claims/beta/v1', description: 'Extra segment before the version' },
    { url: 'https://claims.example.com/api-motor-claims/', description: 'Trailing slash' },
    { url: 'https://api-gateway.example.com/api-motor-claims/v1', description: 'Prefix in host and path' },
    { url: 'http://localhost:8080/api-motor-claims/v1', description: 'Local' },
    { url: 'http://10.40.2.7:9000/api-motor-claims/v1', description: 'Private address' },
    { url: 'http://[::1]:8443/api-motor-claims/v1', description: 'IPv6 loopback' },
    {
      url: '{scheme}://claims.example.com/api-motor-claims/v1',
      description: 'Templated scheme',
      variables: { scheme: { default: 'https', enum: ['https', 'http'] } },
    },
    {
      url: 'https://{environment}.claims.example.com/api-motor-claims/v1',
      description: 'Templated host',
      variables: { environment: { default: 'sandbox', enum: ['sandbox', 'preprod'] } },
    },
    {
      url: 'https://claims.example.com:{port}/api-motor-claims/v1',
      description: 'Templated port',
      variables: { port: { default: '8443' } },
    },
    {
      url: 'https://claims.example.com/api-{brand}/v1',
      description: 'Templated name after the prefix',
      variables: { brand: { default: 'motor-claims' } },
    },
    { url: '/api-motor-claims/v1', description: 'Relative URL' },
    { url: '//cdn.claims.example.com/api-motor-claims/v1', description: 'Protocol-relative URL' },
    { url: 'https://broker@claims.example.com/api-motor-claims/v1', description: 'User info' },
    { url: 'https://claims.example.com/api-motor-claims/v1?region=eu', description: 'Query string' },
    { url: 'https://claims.example.com/api-motor-claims/v1#reference', description: 'Fragment' },
    { url: 'wss://stream.claims.example.com/api-motor-claims/v1', description: 'Streaming' },
    { url: 'HTTPS://CLAIMS.EXAMPLE.COM/api-motor-claims/v1', description: 'Uppercase scheme and host' },
    { url: 'https://claims.example.com/api-2/v1', description: 'Numeric name' },
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
    '/status/database': {
      get: {
        tags: ['Health'],
        operationId: 'getDatabaseStatus',
        responses: { 200: { description: 'The database is reachable' } },
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
    '/claims/{claimId}/documents': {
      get: {
        tags: ['Claims'],
        operationId: 'listClaimDocuments',
        parameters: [{ name: 'claimId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Documents attached to the claim' } },
      },
    },
  },
  'x-legacy-gateway': {
    url: 'https://gateway.example.com/motor-claims/v1',
    basePath: '/motor-claims/v1',
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
          callbackUrl: { type: 'string', format: 'uri', example: 'https://partners.example.com/hooks/v1' },
        },
      },
    },
  },
};
