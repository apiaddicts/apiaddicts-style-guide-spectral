module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Insurance Claims API',
    description: 'Claims, policies and adjusters of the motor insurance line.',
    version: '2.7.1',
  },
  servers: [
    {
      url: 'https://api.insurance.example.com/claims/v2',
    },
  ],
  paths: {
    '/claims': {
      get: {
        operationId: 'listClaims',
        responses: {
          200: {
            description: 'A page of claims',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          claimId: {
                            type: 'string',
                          },
                          claimStatus: {
                            type: 'string',
                          },
                          policy: {
                            type: 'object',
                            nullable: true,
                            properties: {
                              policyNumber: {
                                type: 'string',
                              },
                              holder: {
                                type: 'object',
                                properties: {
                                  fullName: {
                                    type: 'string',
                                  },
                                  birthDate: {
                                    type: 'string',
                                    format: 'date',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    links: {
                      type: 'object',
                      properties: {
                        self: {
                          type: 'string',
                        },
                        nextPage: {
                          type: 'string',
                        },
                      },
                    },
                  },
                  example: {
                    items: [
                      {
                        claimId: 'C-1',
                        claimStatus: 'OPEN',
                      },
                    ],
                    links: {
                      self: '/claims',
                    },
                  },
                },
                examples: {
                  firstPage: {
                    value: {
                      properties: {
                        example_only: 1,
                      },
                    },
                  },
                },
              },
              'text/csv': {
                schema: {
                  type: 'object',
                  properties: {
                    csvRow: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          'x-internal-error': {
            description: 'Never returned to clients',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    internal_trace: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        operationId: 'openClaim',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  claimForm: {
                    $ref: '#/components/schemas/ClaimForm',
                  },
                  photoFiles: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                },
              },
              encoding: {
                photoFiles: {
                  contentType: 'image/png',
                  headers: {
                    'X-Photo-Meta': {
                      schema: {
                        type: 'object',
                        properties: {
                          taken_at: {
                            type: 'string',
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
        responses: {
          201: {
            description: 'Claim opened',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ClaimForm',
                },
              },
            },
          },
        },
        callbacks: {
          claimAssessed: {
            '{$request.body#/claimForm/callbackUrl}': {
              post: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          assessmentId: {
                            type: 'string',
                          },
                          outcome: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
                responses: {
                  200: {
                    description: 'Acknowledged',
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {
                            ackCode: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            'x-retry-policy': {
              post: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          retry_count: {
                            type: 'integer',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          claimClosed: {
            $ref: '#/components/callbacks/ClaimClosed',
          },
        },
      },
    },
    '/claims/{claimId}': {
      parameters: [
        {
          name: 'claimId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      get: {
        responses: {
          200: {
            description: 'The claim',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Claim',
                },
              },
            },
          },
        },
      },
      put: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  putReason: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
      delete: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  deletionNote: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          204: {
            description: 'Deleted',
          },
        },
      },
      options: {
        responses: {
          200: {
            description: 'Allowed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    allowedMethods: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {
            description: 'Exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    headCheck: {
                      type: 'boolean',
                    },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  patchOps: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
      trace: {
        responses: {
          200: {
            description: 'Trace',
            content: {
              'message/http': {
                schema: {
                  type: 'object',
                  properties: {
                    traceHops: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/claims/{claimId}/settlements': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    $ref: '#/components/schemas/CashSettlement',
                  },
                  {
                    $ref: '#/components/schemas/RepairSettlement',
                  },
                ],
                discriminator: {
                  propertyName: 'settlementType',
                  mapping: {
                    CASH: '#/components/schemas/CashSettlement',
                    REPAIR: '#/components/schemas/RepairSettlement',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Settlement accepted',
            content: {
              'application/json': {
                schema: {
                  anyOf: [
                    {
                      type: 'object',
                      properties: {
                        approvedAmount: {
                          type: 'number',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        rejectionCode: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                  not: {
                    type: 'object',
                    properties: {
                      forbiddenFlag: {
                        type: 'boolean',
                      },
                    },
                    required: ['forbiddenFlag'],
                  },
                },
              },
            },
          },
        },
      },
    },
    '/claims/{claimId}/documents': {
      get: {
        responses: {
          200: {
            description: 'Documents grouped by type',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    properties: {
                      type: 'object',
                      'x-display_name': 'Properties',
                      description: 'A property literally named properties.',
                      properties: {
                        pageCount: {
                          type: 'integer',
                        },
                      },
                    },
                    traceId: {
                      type: 'string',
                    },
                    id: {
                      type: 'string',
                    },
                    '': {
                      type: 'string',
                    },
                    userId: {
                      type: 'string',
                    },
                    iPhoneModel: {
                      type: 'string',
                    },
                    addressLine2: {
                      type: 'string',
                    },
                    ipV4Address: {
                      type: 'string',
                    },
                    oauth2Token: {
                      type: 'string',
                    },
                    htmlContent: {
                      type: 'string',
                    },
                    matrix: {
                      type: 'array',
                      items: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            cellValue: {
                              type: 'number',
                            },
                          },
                        },
                      },
                    },
                    byType: {
                      type: 'object',
                      additionalProperties: {
                        type: 'object',
                        properties: {
                          docCount: {
                            type: 'integer',
                          },
                        },
                      },
                    },
                  },
                  'x-internal-fields': {
                    properties: {
                      extension_only: {
                        type: 'string',
                      },
                    },
                  },
                  default: {
                    properties: {
                      default_only: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    'x-draft-paths': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  draft_field: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ok',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ClaimForm: {
        type: 'object',
        properties: {
          callbackUrl: {
            type: 'string',
            format: 'uri',
          },
          incident: {
            type: 'object',
            properties: {
              occurredAt: {
                type: 'string',
                format: 'date-time',
              },
              location: {
                type: 'object',
                properties: {
                  lat: {
                    type: 'number',
                  },
                  lng: {
                    type: 'number',
                  },
                  geoHash: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      Claim: {
        allOf: [
          {
            $ref: '#/components/schemas/ClaimForm',
          },
          {
            type: 'object',
            properties: {
              claimId: {
                type: 'string',
              },
              adjuster: {
                $ref: '#/components/schemas/adjuster',
              },
            },
          },
        ],
      },
      adjuster: {
        type: 'object',
        properties: {
          adjusterId: {
            type: 'string',
          },
          licenseNo: {
            type: 'string',
          },
        },
      },
      CashSettlement: {
        type: 'object',
        properties: {
          settlementType: {
            type: 'string',
          },
          ibanNumber: {
            type: 'string',
          },
        },
      },
      RepairSettlement: {
        type: 'object',
        properties: {
          settlementType: {
            type: 'string',
          },
          workshopId: {
            type: 'string',
          },
        },
      },
      ClosedEvent: {
        type: 'object',
        properties: {
          closedAt: {
            type: 'string',
          },
          closureReason: {
            type: 'string',
          },
        },
      },
    },
    callbacks: {
      ClaimClosed: {
        '{$request.body#/claimForm/callbackUrl}': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ClosedEvent',
                  },
                },
              },
            },
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
