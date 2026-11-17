const ok = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Insurance Claims API', description: 'Claims, policies and adjusters of the motor insurance line.', version: '2.7.1' },
  servers: [{ url: 'https://api.insurance.example.com/claims/v2' }],
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
                          claimId: { type: 'string' },
                          claim_status: { type: 'string' },
                          policy: {
                            type: 'object',
                            nullable: true,
                            properties: {
                              policyNumber: { type: 'string' },
                              holder: {
                                type: 'object',
                                properties: { fullName: { type: 'string' }, birth_date: { type: 'string', format: 'date' } },
                              },
                            },
                          },
                        },
                      },
                    },
                    _links: { type: 'object', properties: { self: { type: 'string' }, next_page: { type: 'string' } } },
                  },
                  example: { items: [{ claimId: 'C-1', claim_status: 'OPEN' }], _links: { self: '/claims' } },
                },
                examples: { firstPage: { value: { properties: { example_only: 1 } } } },
              },
              'text/csv': {
                schema: { type: 'object', properties: { csv_row: { type: 'string' } } },
              },
            },
          },
          'x-internal-error': {
            description: 'Never returned to clients',
            content: { 'application/json': { schema: { type: 'object', properties: { internal_trace: { type: 'string' } } } } },
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
                  claimForm: { $ref: '#/components/schemas/ClaimForm' },
                  photo_files: { type: 'array', items: { type: 'string', format: 'binary' } },
                },
              },
              encoding: {
                photo_files: {
                  contentType: 'image/png',
                  headers: { 'X-Photo-Meta': { schema: { type: 'object', properties: { taken_at: { type: 'string' } } } } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Claim opened', content: { 'application/json': { schema: { $ref: '#/components/schemas/ClaimForm' } } } },
        },
        callbacks: {
          claimAssessed: {
            '{$request.body#/claimForm/callbackUrl}': {
              post: {
                requestBody: {
                  content: {
                    'application/json': {
                      schema: { type: 'object', properties: { assessment_id: { type: 'string' }, outcome: { type: 'string' } } },
                    },
                  },
                },
                responses: {
                  200: { description: 'Acknowledged', content: { 'application/json': { schema: { type: 'object', properties: { ack_code: { type: 'string' } } } } } },
                },
              },
            },
            'x-retry-policy': { post: { requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { retry_count: { type: 'integer' } } } } } } } },
          },
          claimClosed: { $ref: '#/components/callbacks/ClaimClosed' },
        },
      },
    },
    '/claims/{claimId}': {
      parameters: [{ name: 'claimId', in: 'path', required: true, schema: { type: 'string' } }],
      get: { responses: { 200: { description: 'The claim', content: { 'application/json': { schema: { $ref: '#/components/schemas/Claim' } } } } } },
      put: {
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { put_reason: { type: 'string' } } } } } },
        responses: ok,
      },
      delete: {
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { deletion_note: { type: 'string' } } } } } },
        responses: { 204: { description: 'Deleted' } },
      },
      options: { responses: { 200: { description: 'Allowed', content: { 'application/json': { schema: { type: 'object', properties: { allowed_methods: { type: 'array', items: { type: 'string' } } } } } } } } },
      head: { responses: { 200: { description: 'Exists', content: { 'application/json': { schema: { type: 'object', properties: { head_check: { type: 'boolean' } } } } } } } },
      patch: {
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { patch_ops: { type: 'array', items: { type: 'object' } } } } } } },
        responses: ok,
      },
      trace: { responses: { 200: { description: 'Trace', content: { 'message/http': { schema: { type: 'object', properties: { trace_hops: { type: 'integer' } } } } } } } },
    },
    '/claims/{claimId}/settlements': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/CashSettlement' },
                  { $ref: '#/components/schemas/RepairSettlement' },
                ],
                discriminator: { propertyName: 'settlementType', mapping: { CASH: '#/components/schemas/CashSettlement', REPAIR: '#/components/schemas/RepairSettlement' } },
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
                    { type: 'object', properties: { approvedAmount: { type: 'number' } } },
                    { type: 'object', properties: { rejection_code: { type: 'string' } } },
                  ],
                  not: { type: 'object', properties: { forbidden_flag: { type: 'boolean' } }, required: ['forbidden_flag'] },
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
                    properties: { type: 'object', 'x-display_name': 'Properties', description: 'A property literally named properties.', properties: { page_count: { type: 'integer' } } },
                    'x-trace-id': { type: 'string' },
                    '@id': { type: 'string' },
                    '': { type: 'string' },
                    userID: { type: 'string' },
                    iPhoneModel: { type: 'string' },
                    addressLine2: { type: 'string' },
                    ipV4Address: { type: 'string' },
                    oauth2Token: { type: 'string' },
                    HTMLContent: { type: 'string' },
                    matrix: { type: 'array', items: { type: 'array', items: { type: 'object', properties: { cell_value: { type: 'number' } } } } },
                    byType: { type: 'object', additionalProperties: { type: 'object', properties: { doc_count: { type: 'integer' } } } },
                  },
                  'x-internal-fields': { properties: { extension_only: { type: 'string' } } },
                  default: { properties: { default_only: 1 } },
                },
              },
            },
          },
        },
      },
    },
    'x-draft-paths': {
      post: { requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { draft_field: { type: 'string' } } } } } }, responses: ok },
    },
  },
  components: {
    schemas: {
      ClaimForm: {
        type: 'object',
        properties: {
          callbackUrl: { type: 'string', format: 'uri' },
          incident: {
            type: 'object',
            properties: {
              occurredAt: { type: 'string', format: 'date-time' },
              location: { type: 'object', properties: { lat: { type: 'number' }, lng: { type: 'number' }, geo_hash: { type: 'string' } } },
            },
          },
        },
      },
      Claim: {
        allOf: [
          { $ref: '#/components/schemas/ClaimForm' },
          { type: 'object', properties: { claimId: { type: 'string' }, Adjuster: { $ref: '#/components/schemas/Adjuster' } } },
        ],
      },
      Adjuster: { type: 'object', properties: { adjusterId: { type: 'string' }, license_no: { type: 'string' } } },
      CashSettlement: { type: 'object', properties: { settlementType: { type: 'string' }, iban_number: { type: 'string' } } },
      RepairSettlement: { type: 'object', properties: { settlementType: { type: 'string' }, workshop_id: { type: 'string' } } },
      ClosedEvent: { type: 'object', properties: { closedAt: { type: 'string' }, closure_reason: { type: 'string' } } },
    },
    callbacks: {
      ClaimClosed: {
        '{$request.body#/claimForm/callbackUrl}': {
          post: {
            requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ClosedEvent' } } } },
            responses: ok,
          },
        },
      },
    },
  },
};
