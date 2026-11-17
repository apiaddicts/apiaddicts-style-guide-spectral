module.exports = {
  swagger: '2.0',
  info: { title: 'Veterinary Clinic API', description: 'Pets, owners and medical records of the clinic network.', version: '2.3.0' },
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
          { name: 'page_size', in: 'query', type: 'integer' },
          { name: 'X-Request-ID', in: 'header', type: 'string' },
        ],
        responses: {
          200: {
            description: 'A page of pets',
            headers: { 'X-Total-Count': { type: 'integer' } },
            schema: {
              allOf: [
                { $ref: '#/definitions/Paging' },
                { type: 'object', properties: { pets: { type: 'array', items: { $ref: '#/definitions/Pet' } }, result_count: { type: 'integer' } } },
              ],
            },
          },
          'x-cached': { description: 'Served from cache', schema: { type: 'object', properties: { cache_key: { type: 'string' } } } },
          default: { $ref: '#/responses/ErrorResponse' },
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
              required: ['pet_name'],
              properties: {
                pet_name: { type: 'string' },
                ownerId: { type: 'string' },
                Medical_History: { $ref: '#/definitions/MedicalHistory' },
              },
            },
          },
        ],
        responses: {
          201: { description: 'Registered', schema: { $ref: '#/definitions/Pet' } },
          default: { $ref: '#/responses/ErrorResponse' },
        },
      },
    },
    '/pets/{petId}': {
      parameters: [
        { name: 'petId', in: 'path', required: true, type: 'string' },
        { name: 'body', in: 'body', schema: { type: 'object', properties: { update_reason: { type: 'string' }, weightKg: { type: 'number' } } } },
      ],
      get: { responses: { 200: { description: 'The pet', schema: { $ref: '#/definitions/Pet' } } } },
      put: { responses: { 200: { description: 'Updated', schema: { $ref: '#/definitions/Pet' } } } },
      delete: { responses: { 204: { description: 'Deleted' } } },
    },
    '/pets/{petId}/photos': {
      post: {
        consumes: ['multipart/form-data'],
        parameters: [
          { name: 'petId', in: 'path', required: true, type: 'string' },
          { name: 'photo_file', in: 'formData', type: 'file' },
        ],
        responses: { 201: { description: 'Uploaded', schema: { type: 'object', properties: { photo_url: { type: 'string' }, photoId: { type: 'string' } } } } },
      },
    },
    '/owners': {
      get: {
        responses: {
          200: {
            description: 'Owners',
            schema: { type: 'object', properties: { owners: { type: 'array', items: { $ref: '#/definitions/Owner' } }, ownersById: { type: 'object', additionalProperties: { $ref: '#/definitions/Owner' } } } },
          },
        },
      },
      post: {
        parameters: [{ $ref: '#/parameters/OwnerBody' }],
        responses: { 201: { description: 'Created', schema: { $ref: '#/definitions/Owner' } }, 400: { $ref: '#/responses/ValidationError' } },
      },
      patch: { parameters: [{ $ref: '#/parameters/OwnerBody' }], responses: { 200: { description: 'Patched' } } },
      options: { responses: { 200: { description: 'Allowed', schema: { type: 'object', properties: { allowed_verbs: { type: 'array', items: { type: 'string' } } } } } } },
      head: { responses: { 200: { description: 'Exists', schema: { type: 'object', properties: { head_check: { type: 'boolean' } } } } } },
    },
    '/appointments': {
      post: {
        parameters: [{ name: 'body', in: 'body', schema: { $ref: '#/definitions/AppointmentRequest' } }],
        responses: {
          200: { description: 'Audit trail', schema: { $ref: './shared.yaml#/definitions/Audit' } },
          409: { description: 'Slot taken', schema: { $ref: '#/definitions/Missing' } },
        },
      },
    },
    'x-internal-paths': {
      post: { parameters: [{ name: 'body', in: 'body', schema: { type: 'object', properties: { internal_only: { type: 'string' } } } }], responses: { 200: { description: 'Ok' } } },
    },
  },
  definitions: {
    Pet: {
      type: 'object',
      required: ['pet_id', 'name'],
      properties: {
        pet_id: { type: 'string' },
        name: { type: 'string' },
        species: { $ref: '#/definitions/Species' },
        Birth_Date: { type: 'string', format: 'date' },
        owner: { $ref: '#/definitions/Owner' },
        parentPet: { $ref: '#/definitions/Pet' },
        tags: { type: 'array', items: { type: 'object', properties: { tag_name: { type: 'string' } } } },
        attributes: { type: 'object', additionalProperties: { type: 'object', properties: { attr_value: { type: 'string' } } } },
      },
      example: { pet_id: 'P-1', name: 'Rex', Birth_Date: '2020-01-01' },
    },
    Species: { type: 'string', enum: ['DOG', 'CAT', 'BIRD'] },
    MedicalHistory: {
      type: 'object',
      properties: { vaccinations: { type: 'array', items: { type: 'object', properties: { vaccine_code: { type: 'string' }, appliedAt: { type: 'string' } } } } },
    },
    Owner: {
      type: 'object',
      properties: {
        ownerId: { type: 'string' },
        home_address: { $ref: '#/definitions/Address' },
        work_address: { $ref: '#/definitions/Address' },
        preferredClinic: { $ref: '#/definitions/ClinicAlias' },
      },
    },
    Address: { type: 'object', properties: { street_name: { type: 'string' }, zipCode: { type: 'string' } } },
    ClinicAlias: { $ref: '#/definitions/Clinic' },
    Clinic: { type: 'object', properties: { clinicId: { type: 'string' }, opening_hours: { type: 'string' } } },
    AppointmentRequest: {
      type: 'object',
      properties: { slot_start: { type: 'string', format: 'date-time' }, petRef: { $ref: '#/definitions/Pet/properties/species' } },
    },
    Paging: { type: 'object', properties: { total_count: { type: 'integer' }, nextPage: { type: 'string' } } },
    Error: { type: 'object', properties: { error_code: { type: 'string' }, message: { type: 'string' } } },
    ValidationErrors: { type: 'object', properties: { field_errors: { type: 'array', items: { $ref: '#/definitions/Error' } } } },
    UnusedDefinition: { type: 'object', properties: { unused_prop: { type: 'string' } } },
  },
  parameters: {
    OwnerBody: { name: 'body', in: 'body', required: true, schema: { $ref: '#/definitions/Owner' } },
    UnusedBody: { name: 'body', in: 'body', schema: { type: 'object', properties: { unused_param_prop: { type: 'string' } } } },
  },
  responses: {
    ErrorResponse: { description: 'Error', schema: { $ref: '#/definitions/Error' } },
    ValidationError: { description: 'Validation failed', schema: { $ref: '#/definitions/ValidationErrors' } },
    UnusedResponse: { description: 'Unused', schema: { type: 'object', properties: { unused_response_prop: { type: 'string' } } } },
  },
};
