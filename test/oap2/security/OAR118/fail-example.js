module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.12.0', description: 'Appointments, owners and veterinarians.' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  security: [{ petstore_auth: ['appointments:read'] }],
  paths: {
    '/appointments': {
      get: {
        operationId: 'listAppointments',
        summary: 'List appointments',
        responses: {
          200: { description: 'Appointments', schema: { type: 'array', items: { $ref: '#/definitions/Appointment' } } },
        },
      },
      post: {
        operationId: 'bookAppointment',
        summary: 'Book an appointment',
        security: [{ OwnerPassword: ['appointments:write'] }, { VetAccessCode: [] }],
        parameters: [{ name: 'body', in: 'body', required: true, schema: { $ref: '#/definitions/Appointment' } }],
        responses: { 201: { description: 'Booked' } },
      },
    },
    '/clinics/sync': {
      post: {
        operationId: 'syncClinics',
        security: [{ ClinicApp: [] }, { ClinicKey: [] }, { StaffBasic: [] }],
        responses: { 202: { description: 'Sync started' } },
      },
    },
  },
  securityDefinitions: {
    petstore_auth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      scopes: { 'appointments:read': 'Read appointments' },
    },
    OwnerPassword: {
      type: 'oauth2',
      flow: 'password',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: { 'appointments:write': 'Book appointments' },
    },
    VetAccessCode: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: {},
    },
    ClinicApp: {
      type: 'oauth2',
      flow: 'application',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: {},
    },
    ClinicKey: { type: 'apiKey', in: 'header', name: 'X-Clinic-Key' },
    StaffBasic: { type: 'basic' },
  },
  definitions: {
    Appointment: {
      type: 'object',
      required: ['petId', 'startsAt'],
      properties: {
        petId: { type: 'string' },
        startsAt: { type: 'string', format: 'date-time' },
        reason: { type: 'string' },
      },
    },
  },
};
