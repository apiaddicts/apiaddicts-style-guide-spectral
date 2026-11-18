module.exports = {
  swagger: '2.0',
  info: {
    title: 'Veterinary Clinic API',
    description: 'Pets, owners and medical records of the clinic network.',
    version: '2.3.0',
  },
  host: 'api.vetclinic.example.com',
  basePath: '/clinic/v2',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/pets': {
      get: {
        operationId: 'listPets',
        parameters: [
          {
            name: 'page_size',
            in: 'query',
            type: 'integer',
          },
          {
            name: 'X-Request-ID',
            in: 'header',
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'A page of pets',
            headers: {
              'X-Total-Count': {
                type: 'integer',
              },
            },
            schema: {
              allOf: [
                {
                  $ref: '#/definitions/Paging',
                },
                {
                  type: 'object',
                  properties: {
                    pets: {
                      type: 'array',
                      items: {
                        $ref: '#/definitions/Pet',
                      },
                    },
                    resultCount: {
                      type: 'integer',
                    },
                  },
                },
              ],
            },
          },
          'x-cached': {
            description: 'Served from cache',
            schema: {
              type: 'object',
              properties: {
                cache_key: {
                  type: 'string',
                },
              },
            },
          },
          default: {
            $ref: '#/responses/ErrorResponse',
          },
        },
      },
      post: {
        operationId: 'registerPet',
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['petName'],
              properties: {
                petName: {
                  type: 'string',
                },
                ownerId: {
                  type: 'string',
                },
                medicalHistory: {
                  $ref: '#/definitions/MedicalHistory',
                },
              },
            },
          },
        ],
        responses: {
          201: {
            description: 'Registered',
            schema: {
              $ref: '#/definitions/Pet',
            },
          },
          default: {
            $ref: '#/responses/ErrorResponse',
          },
        },
      },
    },
    '/pets/{petId}': {
      parameters: [
        {
          name: 'petId',
          in: 'path',
          required: true,
          type: 'string',
        },
        {
          name: 'body',
          in: 'body',
          schema: {
            type: 'object',
            properties: {
              updateReason: {
                type: 'string',
              },
              weightKg: {
                type: 'number',
              },
            },
          },
        },
      ],
      get: {
        responses: {
          200: {
            description: 'The pet',
            schema: {
              $ref: '#/definitions/Pet',
            },
          },
        },
      },
      put: {
        responses: {
          200: {
            description: 'Updated',
            schema: {
              $ref: '#/definitions/Pet',
            },
          },
        },
      },
      delete: {
        responses: {
          204: {
            description: 'Deleted',
          },
        },
      },
    },
    '/pets/{petId}/photos': {
      post: {
        consumes: ['multipart/form-data'],
        parameters: [
          {
            name: 'petId',
            in: 'path',
            required: true,
            type: 'string',
          },
          {
            name: 'photo_file',
            in: 'formData',
            type: 'file',
          },
        ],
        responses: {
          201: {
            description: 'Uploaded',
            schema: {
              type: 'object',
              properties: {
                photoUrl: {
                  type: 'string',
                },
                photoId: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    '/owners': {
      get: {
        responses: {
          200: {
            description: 'Owners',
            schema: {
              type: 'object',
              properties: {
                owners: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/Owner',
                  },
                },
                ownersById: {
                  type: 'object',
                  additionalProperties: {
                    $ref: '#/definitions/Owner',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        parameters: [
          {
            $ref: '#/parameters/OwnerBody',
          },
        ],
        responses: {
          201: {
            description: 'Created',
            schema: {
              $ref: '#/definitions/Owner',
            },
          },
          400: {
            $ref: '#/responses/ValidationError',
          },
        },
      },
      patch: {
        parameters: [
          {
            $ref: '#/parameters/OwnerBody',
          },
        ],
        responses: {
          200: {
            description: 'Patched',
          },
        },
      },
      options: {
        responses: {
          200: {
            description: 'Allowed',
            schema: {
              type: 'object',
              properties: {
                allowedVerbs: {
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
      head: {
        responses: {
          200: {
            description: 'Exists',
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
    '/appointments': {
      post: {
        parameters: [
          {
            name: 'body',
            in: 'body',
            schema: {
              $ref: '#/definitions/AppointmentRequest',
            },
          },
        ],
        responses: {
          200: {
            description: 'Audit trail',
            schema: {
              $ref: './shared.yaml#/definitions/Audit',
            },
          },
          409: {
            description: 'Slot taken',
            schema: {
              $ref: '#/definitions/Missing',
            },
          },
        },
      },
    },
    'x-internal-paths': {
      post: {
        parameters: [
          {
            name: 'body',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                internal_only: {
                  type: 'string',
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
    },
  },
  definitions: {
    Pet: {
      type: 'object',
      required: ['petId', 'name'],
      properties: {
        petId: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        species: {
          $ref: '#/definitions/Species',
        },
        birthDate: {
          type: 'string',
          format: 'date',
        },
        owner: {
          $ref: '#/definitions/Owner',
        },
        parentPet: {
          $ref: '#/definitions/Pet',
        },
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tagName: {
                type: 'string',
              },
            },
          },
        },
        attributes: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              attrValue: {
                type: 'string',
              },
            },
          },
        },
      },
      example: {
        petId: 'P-1',
        name: 'Rex',
        birthDate: '2020-01-01',
      },
    },
    Species: {
      type: 'string',
      enum: ['DOG', 'CAT', 'BIRD'],
    },
    MedicalHistory: {
      type: 'object',
      properties: {
        vaccinations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              vaccineCode: {
                type: 'string',
              },
              appliedAt: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    Owner: {
      type: 'object',
      properties: {
        ownerId: {
          type: 'string',
        },
        homeAddress: {
          $ref: '#/definitions/Address',
        },
        workAddress: {
          $ref: '#/definitions/Address',
        },
        preferredClinic: {
          $ref: '#/definitions/ClinicAlias',
        },
      },
    },
    Address: {
      type: 'object',
      properties: {
        streetName: {
          type: 'string',
        },
        zipCode: {
          type: 'string',
        },
      },
    },
    ClinicAlias: {
      $ref: '#/definitions/Clinic',
    },
    Clinic: {
      type: 'object',
      properties: {
        clinicId: {
          type: 'string',
        },
        openingHours: {
          type: 'string',
        },
      },
    },
    AppointmentRequest: {
      type: 'object',
      properties: {
        slotStart: {
          type: 'string',
          format: 'date-time',
        },
        petRef: {
          $ref: '#/definitions/Pet/properties/species',
        },
      },
    },
    Paging: {
      type: 'object',
      properties: {
        totalCount: {
          type: 'integer',
        },
        nextPage: {
          type: 'string',
        },
      },
    },
    Error: {
      type: 'object',
      properties: {
        errorCode: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
      },
    },
    ValidationErrors: {
      type: 'object',
      properties: {
        fieldErrors: {
          type: 'array',
          items: {
            $ref: '#/definitions/Error',
          },
        },
      },
    },
    UnusedDefinition: {
      type: 'object',
      properties: {
        unused_prop: {
          type: 'string',
        },
      },
    },
  },
  parameters: {
    OwnerBody: {
      name: 'body',
      in: 'body',
      required: true,
      schema: {
        $ref: '#/definitions/Owner',
      },
    },
    UnusedBody: {
      name: 'body',
      in: 'body',
      schema: {
        type: 'object',
        properties: {
          unused_param_prop: {
            type: 'string',
          },
        },
      },
    },
  },
  responses: {
    ErrorResponse: {
      description: 'Error',
      schema: {
        $ref: '#/definitions/Error',
      },
    },
    ValidationError: {
      description: 'Validation failed',
      schema: {
        $ref: '#/definitions/ValidationErrors',
      },
    },
    UnusedResponse: {
      description: 'Unused',
      schema: {
        type: 'object',
        properties: {
          unused_response_prop: {
            type: 'string',
          },
        },
      },
    },
  },
};
