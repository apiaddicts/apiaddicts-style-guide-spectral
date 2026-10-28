module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.12.0', description: 'Appointments, owners and veterinarians.' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  schemes: ['https'],
  security: [{ petstore_auth: ['appointments:read'] }],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', responses: { 200: { description: 'Appointments' } } },
      post: {
        operationId: 'bookAppointment',
        security: [{ VetAccessCode: [] }, { ClinicApp: [] }, { OwnerPassword: [] }],
        responses: { 201: { description: 'Booked' } },
      },
    },
    '/clinics': { get: { operationId: 'listClinics', security: [{ ClinicKey: [] }, { PortalAuth: [] }], responses: { 200: { description: 'Clinics' } } } },
  },
  securityDefinitions: {
    petstore_auth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'http://auth.petclinic.example.com/oauth/authorize',
      scopes: { 'appointments:read': 'Read appointments' },
    },
    VetAccessCode: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/dialog',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: {},
    },
    ClinicApp: {
      type: 'oauth2',
      flow: 'application',
      authorizationUrl: 'https://petclinic/authorize',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/token',
      scopes: {},
    },
    OwnerPassword: { type: 'oauth2', flow: 'password', tokenUrl: 'https://auth.petclinic.example.com/oauth/token', scopes: {} },
    PortalAuth: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://portal.petclinic.example.com/authorize',
      tokenUrl: 'https://portal.petclinic.example.com/token',
      scopes: {},
    },
    ClinicKey: { type: 'apiKey', in: 'header', name: 'X-Clinic-Key', authorizationUrl: 'http://ignored' },
  },
};
