const NAMES = [
  'userId', 'user_id', 'user-id', 'UserId', 'USER_ID', 'USER-ID', 'userid', 'USERID', 'fileV2', 'v2File', 'user2', 'ipV4Address',
  'userID', 'HTMLContent', 'iPhone', 'a', 'A', 'z9', '_links', '@type', '$schema', 'x-trace-id', 'user.name', 'user/name', '.hidden',
  '-leading', '_leading', 'user-Name', 'User_Name', 'zonaORLA', 'coberturaORLA', 'gvalAQS', 'userName1', 'user1Name', 'name 1',
  'año2024', 'über', 'customer_id_2', 'customer-id-2', '2fa', '123', 'Id', 'aB', 'aBC', 'Ab', 'ABc', 'ab1C', 'user$id', 'UserID',
  'Address2', 'V2File', '',
];
const REFERENCED = new Set(['coberturaORLA', 'user_id', 'UserId']);

const properties = () => Object.fromEntries(NAMES.map((name) => [
  name,
  REFERENCED.has(name) ? { $ref: '#/components/schemas/Code' } : { type: 'string', description: `The ${name || 'unnamed'} attribute.` },
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
    '/accounts/{accountId}': {
      parameters: [{ name: 'accountId', in: 'path', required: true, schema: { type: 'string' } }],
      get: { responses: { 200: { $ref: '#/components/responses/AccountProfile' } } },
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
