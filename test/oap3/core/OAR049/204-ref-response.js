module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'OAR049 Ref Response Fixture API',
  },
  components: {
    responses: {
      NoContent: {
        description: 'Standard no-content response, shared across operations',
      },
    },
  },
  paths: {
    '/subscriptions/{subscriptionId}': {
      delete: {
        summary: 'Cancel a subscription',
        responses: {
          204: {
            description: 'Standard no-content response, shared across operations',
          },
        },
      },
    },
  },
};
