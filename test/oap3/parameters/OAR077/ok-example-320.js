module.exports = {
  openapi: '3.2.0',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  paths: {
    '/customers/search': {
      query: {
        parameters: [
          {
            in: 'query',
            name: 'max_results2',
            schema: {
              type: ['integer', 'null'],
            },
          },
          {
            in: 'querystring',
            name: 'SearchQuery',
            content: {
              'application/x-www-form-urlencoded': {
                schema: {
                  type: 'object',
                  properties: {
                    FullName: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
      additionalOperations: {
        LINK: {
          parameters: [
            {
              in: 'query',
              name: 'relation_type1',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            204: {
              description: 'No Content',
            },
          },
          callbacks: {
            linkConfirmed: {
              '{$request.query.callback_url}': {
                parameters: [
                  {
                    in: 'query',
                    name: 'confirmation_id',
                    schema: {
                      type: 'string',
                    },
                  },
                ],
                post: {
                  parameters: [
                    {
                      in: 'query',
                      name: 'confirmation_round2',
                      schema: {
                        type: 'integer',
                      },
                    },
                  ],
                  responses: {
                    200: {
                      description: 'Ok',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/customers/{customerId}': {
      get: {
        parameters: [
          {
            in: 'path',
            name: 'customerId',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
        callbacks: {
          statusChanged: {
            '{$request.query.callback_url}': {
              additionalOperations: {
                NOTIFY: {
                  parameters: [
                    {
                      in: 'query',
                      name: 'notify_level1',
                      schema: {
                        type: 'string',
                      },
                    },
                  ],
                  responses: {
                    200: {
                      description: 'Ok',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  webhooks: {
    customerPurged: {
      additionalOperations: {
        PURGE: {
          parameters: [
            {
              in: 'query',
              name: 'purge_batch2',
              schema: {
                type: ['string', 'null'],
              },
            },
          ],
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
    },
  },
};
