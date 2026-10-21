const object = (properties) => ({ type: 'object', properties });
const block = (name, properties) => object({ [name]: object(properties) });
const created = (schema) => ({ description: 'Created', schema });

module.exports = {
  swagger: '2.0',
  info: { version: '3.0.0', title: 'Platform Operations API' },
  basePath: '/platform/v3',
  produces: ['application/json'],
  paths: {
    '/status': {
      post: {
        operationId: 'refreshStatus',
        responses: { 201: created(object({ status: { type: 'string', enum: ['UP', 'DOWN'] } })) },
      },
    },
    '/health': {
      post: {
        operationId: 'refreshHealth',
        responses: { 201: created(block('result', { code: { type: 'string' } })) },
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
        responses: { 201: created(block('payload', { orderId: { type: 'string' } })) },
      },
    },
    '/orders/{orderId}/items': {
      parameters: [{ name: 'orderId', in: 'path', required: true, type: 'string' }],
      post: {
        operationId: 'addOrderItem',
        responses: { 201: created(block('payload', { itemId: { type: 'string' } })) },
      },
    },
    '/health-checks': {
      post: {
        operationId: 'runHealthCheck',
        responses: { 201: created(block('data', { checkId: { type: 'string' } })) },
      },
    },
    '/alerts': {
      post: {
        operationId: 'createAlert',
        responses: { 201: { $ref: '#/responses/LegacyCreated' } },
      },
    },
    '/subscriptions': {
      post: {
        operationId: 'createSubscription',
        responses: { 201: { $ref: '#/responses/LegacyCreated' } },
      },
    },
  },
  responses: {
    LegacyCreated: { description: 'Created with the legacy envelope', schema: { $ref: '#/definitions/LegacyEnvelope' } },
  },
  definitions: {
    LegacyEnvelope: block('payload', { id: { type: 'string' } }),
  },
};
