module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR007 ok example' },
  paths: {
    '/invoices': {
      get: {
        responses: {
          200: {
            description: 'Has content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
          204: { description: 'No body, must be ignored by the rule' },
          400: {
            description: 'Has content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
      post: {
        responses: {
          201: {
            description: 'Has content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
          500: {
            description: 'Has content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
      put: {
        responses: {
          200: {
            description: 'Has content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
          default: {
            description: 'Catch-all response with content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/orders': {
      patch: {
        responses: {
          200: {
            description: 'Has content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
      delete: {
        responses: {
          204: { description: 'No body, must be ignored by the rule' },
          404: {
            description: 'Has content',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
  },
};
