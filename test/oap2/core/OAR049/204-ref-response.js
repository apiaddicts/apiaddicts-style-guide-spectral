module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'OAR049 Ref Response Fixture API',
  },
  responses: {
    NoContent: {
      description: 'Standard no-content response, shared across operations',
    },
  },
  paths: {
    '/subscriptions/{subscriptionId}': {
      delete: {
        summary: 'Cancel a subscription',
        parameters: [
          {
            in: 'path',
            name: 'subscriptionId',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          // Resolved shape of `$ref: '#/responses/NoContent'`
          204: {
            description: 'Standard no-content response, shared across operations',
          },
        },
      },
    },
  },
};
