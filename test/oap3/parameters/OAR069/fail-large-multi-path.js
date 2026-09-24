module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'OAR069 OpenAPI 3.0 large multi-path - fail',
  },
  paths: {
    '/tasks': {
      get: {
        summary: 'List tasks',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
      post: {
        summary: 'Create a task',
        requestBody: {
          content: {
            'application/json': { schema: { type: 'object' } },
          },
        },
        responses: {
          '201': { description: 'Created' },
        },
      },
    },
    '/tasks/{taskId}': {
      parameters: [
        { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'Get a task',
        responses: {
          '200': { description: 'OK' },
        },
      },
      delete: {
        summary: 'Delete a task',
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            description: 'Overrides the shared taskId parameter',
            schema: { type: 'string' },
          },
          { name: 'force', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          '204': { description: 'No Content' },
        },
      },
    },
    '/tasks/{taskId}/comments': {
      parameters: [
        { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'List comments for a task',
        parameters: [
          { name: 'authorId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/users/{userId}': {
      get: {
        summary: 'Get a user',
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'include', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/users/{userId}/status': {
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'Get a user status - compliant, has a 400',
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Health check - no parameters at all',
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
    '/orders/{orderId}': {
      parameters: [
        { $ref: '#/components/parameters/OrderIdParam' },
      ],
      get: {
        summary: 'Get an order',
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
  components: {
    parameters: {
      OrderIdParam: { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
    },
  },
};
