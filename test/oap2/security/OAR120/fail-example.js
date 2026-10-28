module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.12.0', description: 'Appointments, owners and veterinarians.' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  schemes: ['https'],
  security: [{ OwnerPassword: [] }],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', responses: { 200: { description: 'Appointments' } } },
      post: {
        operationId: 'bookAppointment',
        security: [{ VetAccessCode: [] }, { ClinicApp: [] }, { petstore_auth: [] }],
        responses: { 201: { description: 'Booked' } },
      },
    },
    '/clinics': { get: { operationId: 'listClinics', security: [{ ClinicKey: [] }, { PortalAuth: [] }], responses: { 200: { description: 'Clinics' } } } },
  },
  securityDefinitions: {
    OwnerPassword: { type: 'oauth2', flow: 'password', tokenUrl: 'http://auth.petclinic.example.com/oauth/token', scopes: {} },
    VetAccessCode: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      tokenUrl: 'https://auth.petclinic.example.com/oauth/access',
      scopes: {},
    },
    ClinicApp: { type: 'oauth2', flow: 'application', tokenUrl: 'https://petclinic/token', scopes: {} },
    petstore_auth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      tokenUrl: 'http://implicit-has-no-token-url.example.com/token',
      scopes: {},
    },
    PortalAuth: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://portal.petclinic.example.com/authorize',
      tokenUrl: 'https://portal.petclinic.example.com/token',
      scopes: {},
    },
    ClinicKey: { type: 'apiKey', in: 'header', name: 'X-Clinic-Key', tokenUrl: 'http://ignored' },
  },
};
