module.exports = {
  swagger: '2.0',
  info: { title: 'Pet Clinic API', version: '1.13.0' },
  host: 'api.petclinic.example.com',
  basePath: '/v1',
  schemes: ['https'],
  security: [{ VetAccessCode: [] }],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', responses: { 200: { description: 'Appointments' } } },
      post: { operationId: 'bookAppointment', security: [{ OwnerImplicit: [] }, { ClinicApp: [] }], responses: { 201: { description: 'Booked' } } },
    },
  },
  securityDefinitions: {
    VetAccessCode: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://auth.petclinic.example.com/oauth/authorize',
      tokenUrl: 'http://not-checked-by-this-rule/token',
      scopes: {},
    },
    OwnerImplicit: { type: 'oauth2', flow: 'implicit', authorizationUrl: 'https://auth.petclinic.example.com:8443/authorize', scopes: {} },
    ClinicApp: { type: 'oauth2', flow: 'application', tokenUrl: 'https://auth.petclinic.example.com/oauth/token', scopes: {} },
    StaffBasic: { type: 'basic' },
  },
};
