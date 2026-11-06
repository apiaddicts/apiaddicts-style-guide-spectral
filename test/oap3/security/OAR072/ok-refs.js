module.exports = {
  openapi: '3.0.3',
  info: { title: 'Subscriptions API', version: '1.4.0' },
  servers: [{ url: 'https://api.subscriptions.example.com/v1' }],
  paths: {
    '/subscriptions/{subscriptionId}': {
      parameters: [{ name: 'subscriptionId', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        operationId: 'getSubscription',
        responses: {
          200: { $ref: '#/components/responses/SubscriptionWithDebug' },
          400: { description: 'Dangling', content: { 'application/json': { schema: { $ref: '#/components/schemas/DoesNotExist' } } } },
          404: { description: 'Circular', content: { 'application/json': { schema: { $ref: '#/components/schemas/CircularA' } } } },
          500: { $ref: '#/components/responses/Missing' },
          409: {
            description: 'Keywords next to $ref are ignored in OpenAPI 3.0',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Subscription', properties: { stack_trace: { type: 'string' } } } } },
          },
          503: { description: 'External schema that cannot be read', content: { 'application/json': { schema: { $ref: './schemas/missing-errors.yaml#/Error' } } } },
        },
      },
      patch: {
        operationId: 'updateSubscription',
        requestBody: { $ref: '#/components/requestBodies/SubscriptionPatch' },
        responses: { 204: { description: 'Updated' } },
      },
    },
  },
  components: {
    requestBodies: {
      SubscriptionPatch: { content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } },
    },
    responses: {
      SubscriptionWithDebug: {
        description: 'Subscription',
        content: { 'application/json': { schema: { allOf: [{ $ref: '#/components/schemas/Subscription' }, { $ref: '#/components/schemas/Debug' }] } } },
      },
    },
    schemas: {
      Subscription: { type: 'object', properties: { plan: { type: 'string' } } },
      Debug: { type: 'object', properties: { stackTrace: { type: 'string' } } },
      CircularA: { type: 'object', properties: { next: { $ref: '#/components/schemas/CircularB' } } },
      CircularB: { type: 'object', properties: { previous: { $ref: '#/components/schemas/CircularA' }, traceId: { type: 'string' } } },
    },
  },
};
