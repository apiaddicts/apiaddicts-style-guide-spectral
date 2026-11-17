const NAMES = ['userId', 'userid', 'fileV2', 'v2File', 'user2', 'ipV4Address', 'iPhone', 'a', 'userName1', 'user1Name', 'oauth2Token', 'addressLine2', ''];

const properties = () => Object.fromEntries(NAMES.map((name) => [
  name,
  name === 'userId' ? { $ref: '#/components/schemas/Code' } : { type: 'string', description: `The ${name || 'unnamed'} attribute.` },
]));

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Account Profiles API', description: 'Profiles of the accounts of the self-service portal.', version: '1.9.0' },
  servers: [{ url: 'https://api.portal.example.com/profiles/v1' }],
  paths: {
    '/accounts': {
      post: {
        operationId: 'createAccountProfile',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: properties() } } } },
        responses: { 201: { $ref: '#/components/responses/AccountProfile' } },
      },
    },
  },
  components: {
    schemas: {
      Code: { type: 'string', enum: ['A1', 'B2'] },
      AccountProfile: { type: 'object', properties: properties() },
    },
    responses: {
      AccountProfile: { description: 'The account profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/AccountProfile' } } } },
    },
  },
};
