const created = (schema) => ({
  description: 'Created',
  content: { 'application/json': { schema } },
});

const block = (name, properties) => ({ type: 'object', properties: { [name]: { type: 'object', properties } } });

module.exports = {
  openapi: '3.0.3',
  info: { version: '3.0.0', title: 'Platform Operations API' },
  paths: {
    '/status': {
      post: {
        operationId: 'refreshStatus',
        responses: {
          201: created({ type: 'object', properties: { status: { type: 'string', enum: ['UP', 'DOWN'] } } }),
        },
      },
    },
    '/health': {
      post: {
        operationId: 'refreshHealth',
        responses: {
          201: created(block('result', { code: { type: 'string' } })),
        },
      },
    },
    '/me': {
      post: {
        operationId: 'refreshMyProfile',
        responses: { 201: created(block('profile', { userId: { type: 'string' } })) },
      },
    },
    '/ping': {
      post: {
        operationId: 'ping',
        responses: { 201: created({ type: 'object', properties: { pong: { type: 'string' } } }) },
      },
    },
    '/me/preferences': {
      post: {
        operationId: 'saveMyPreferences',
        responses: { 201: created(block('payload', { theme: { type: 'string' } })) },
      },
    },
    '/orders': {
      post: {
        operationId: 'createOrder',
        responses: {
          201: created(block('payload', { orderId: { type: 'string' } })),
        },
      },
    },
    '/orders/{orderId}/items': {
      parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
      post: {
        operationId: 'addOrderItem',
        responses: {
          201: created(block('payload', { itemId: { type: 'string' } })),
        },
      },
    },
    '/health-checks': {
      post: {
        operationId: 'runHealthCheck',
        responses: {
          201: created(block('data', { checkId: { type: 'string' } })),
        },
      },
    },
    '/alerts': {
      post: {
        operationId: 'createAlert',
        responses: { 201: { $ref: '#/components/responses/LegacyCreated' } },
      },
    },
    '/subscriptions': {
      post: {
        operationId: 'createSubscription',
        responses: { 201: { $ref: '#/components/responses/LegacyCreated' } },
      },
    },
  },
  components: {
    responses: {
      LegacyCreated: {
        description: 'Created with the legacy envelope',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/LegacyEnvelope' } } },
      },
    },
    schemas: {
      LegacyEnvelope: block('payload', { id: { type: 'string' } }),
    },
  },
};
