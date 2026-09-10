module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OAR007 fail example' },
  paths: {
    '/invoices': {
      get: {
        responses: {
          200: { description: 'Missing content entirely' },
          204: { description: 'No body, must be ignored by the rule' },
          400: { description: 'Missing content entirely' },
        },
      },
      post: {
        responses: {
          201: { description: 'Empty content object, no media types', content: {} },
          500: { description: 'Missing content entirely' },
        },
      },
      put: {
        responses: {
          200: {
            description: 'Has content, should not be flagged',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
          default: { description: 'Catch-all response missing content entirely' },
        },
      },
    },
    '/orders': {
      patch: {
        responses: {
          200: { description: 'Missing content entirely' },
        },
      },
      delete: {
        responses: {
          204: { description: 'No body, must be ignored by the rule' },
          404: { description: 'Missing content entirely' },
        },
      },
    },
  },
};
