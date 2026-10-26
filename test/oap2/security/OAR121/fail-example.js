module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.12.0', description: 'Appointments, owners and veterinarians.' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  schemes: ['https'],
  security: [{ VetAccessCode: [] }],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', responses: { 200: { description: 'Appointments' } } },
      post: { operationId: 'bookAppointment', security: [{ StaffBasic: [] }, { ClinicKey: [] }], responses: { 201: { description: 'Booked' } } },
    },
    '/clinics': { get: { operationId: 'listClinics', security: [{ ClinicApp: [], LegacyBasic: [] }], responses: { 200: { description: 'Clinics' } } } },
  },
  securityDefinitions: {
    VetAccessCode: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: {},
    },
    ClinicApp: { type: 'oauth2', flow: 'application', tokenUrl: 'https://auth.petclinic.example.com/oauth/token', scopes: {} },
    StaffBasic: { type: 'basic' },
    LegacyBasic: { type: 'Basic', description: 'Old staff portal.' },
    ClinicKey: { type: 'apiKey', in: 'header', name: 'X-Clinic-Key' },
  },
};
