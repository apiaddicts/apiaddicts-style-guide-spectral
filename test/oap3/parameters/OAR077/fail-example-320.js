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
            name: 'MaxResults2',
            schema: {
              type: ['integer', 'null'],
            },
          },
          {
            in: 'query',
            name: 'max_results2',
            schema: {
              type: 'integer',
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
              name: 'RelationType1',
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
                    name: 'ConfirmationId',
                    schema: {
                      type: 'string',
                    },
                  },
                ],
                post: {
                  parameters: [
                    {
                      in: 'query',
                      name: 'ConfirmationRound2',
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
                      name: 'NotifyLevel1',
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
              name: 'PurgeBatch2',
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
