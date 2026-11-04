module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.13.0' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  schemes: ['https'],
  security: [{ VetAccessCode: ['appointments:read'] }],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', responses: { 200: { description: 'Appointments' } } },
      post: {
        operationId: 'bookAppointment',
        security: [{ VetAccessCode: ['appointments:write'] }, { ClinicKey: [] }],
        responses: { 201: { description: 'Booked' } },
      },
    },
    '/clinics/sync': {
      post: {
        operationId: 'syncClinics',
        security: [{ ClinicApp: [], StaffBasic: [] }],
        responses: { 202: { description: 'Sync started' } },
      },
    },
  },
  securityDefinitions: {
    VetAccessCode: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: { 'appointments:read': 'Read appointments', 'appointments:write': 'Book appointments' },
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
};
