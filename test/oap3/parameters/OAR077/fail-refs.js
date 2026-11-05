module.exports = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Customer Onboarding API',
  },
  paths: {
    '/customers': {
      parameters: [
        {
          $ref: '#/components/parameters/regionParam',
        },
      ],
      get: {
        parameters: [
          {
            $ref: '#/components/parameters/onboardingStatusParam',
          },
          {
            $ref: '#/components/parameters/pageSizeAlias',
          },
          {
            $ref: '#/components/parameters/customerIdPath',
          },
        ],
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
      post: {
        parameters: [
          {
            $ref: '#/components/parameters/dryRun1',
          },
        ],
        responses: {
          202: {
            description: 'Accepted',
          },
        },
        callbacks: {
          onboardingCompleted: {
            $ref: '#/components/callbacks/onboardingCompleted',
          },
        },
      },
    },
  },
  components: {
    parameters: {
      regionParam: {
        in: 'query',
        name: 'Region2',
        schema: {
          type: 'string',
        },
      },
      onboardingStatusParam: {
        in: 'query',
        name: 'onboarding_status1',
        schema: {
          type: 'string',
        },
      },
      pageSizeAlias: {
        $ref: '#/components/parameters/pageSizeParam',
      },
      pageSizeParam: {
        in: 'query',
        name: 'pageSize2',
        schema: {
          type: 'integer',
        },
      },
      customerIdPath: {
        in: 'path',
        name: 'CustomerId2',
        required: true,
        schema: {
          type: 'string',
        },
      },
      dryRun1: {
        in: 'query',
        name: 'dry_run1',
        schema: {
          type: 'boolean',
        },
      },
      callbackAttempt: {
        in: 'query',
        name: 'Attempt3',
        schema: {
          type: 'integer',
        },
      },
      unusedParam: {
        in: 'query',
        name: 'UnusedParam',
        schema: {
          type: 'string',
        },
      },
    },
    callbacks: {
      onboardingCompleted: {
        '{$request.body#/callbackUrl}': {
          post: {
            parameters: [
              {
                $ref: '#/components/parameters/callbackAttempt',
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
};
