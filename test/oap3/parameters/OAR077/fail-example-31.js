module.exports = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  paths: {
    '/customers': {
      $ref: '#/components/pathItems/customerCollection',
    },
    '/customers/{customerId}': {
      parameters: [
        {
          in: 'path',
          name: 'customerId',
          required: true,
          schema: {
            type: 'string',
          },
        },
        {
          in: 'query',
          name: 'IncludeArchived1',
          schema: {
            type: ['boolean', 'null'],
          },
        },
      ],
      patch: {
        parameters: [
          {
            $ref: '#/components/parameters/notifyChannel',
            description: 'Channel used to notify the customer.',
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
        callbacks: {
          kycReviewed: {
            '{$request.body#/callbackUrl}': {
              parameters: [
                {
                  in: 'query',
                  name: 'DeliveryId1',
                  schema: {
                    type: ['string', 'null'],
                  },
                },
              ],
              post: {
                parameters: [
                  {
                    in: 'query',
                    name: 'review_round2',
                    schema: {
                      type: 'integer',
                    },
                  },
                  {
                    in: 'query',
                    name: 'ReviewerId',
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
      },
    },
  },
  webhooks: {
    customerCreated: {
      parameters: [
        {
          in: 'query',
          name: 'TenantId',
          schema: {
            type: 'string',
          },
        },
      ],
      post: {
        parameters: [
          {
            in: 'query',
            name: 'event_version2',
            schema: {
              type: 'integer',
            },
          },
          {
            in: 'query',
            name: 'eventVersion2',
            schema: {
              type: ['integer', 'null'],
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
    customerArchived: {
      $ref: '#/components/pathItems/customerArchivedHook',
    },
  },
  components: {
    parameters: {
      notifyChannel: {
        in: 'query',
        name: 'NotifyChannel3',
        schema: {
          type: ['string', 'null'],
          enum: ['sms', 'email2', null],
        },
      },
    },
    pathItems: {
      customerCollection: {
        get: {
          parameters: [
            {
              in: 'query',
              name: 'onboarding_status1',
              schema: {
                type: ['string', 'null'],
              },
            },
            {
              in: 'query',
              name: 'createdAfter',
              schema: {
                type: 'string',
                format: 'date',
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
      customerArchivedHook: {
        post: {
          parameters: [
            {
              in: 'query',
              name: 'ArchiveReason',
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
};
