const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.health.example.com/appointments/openapi.yaml',
  info: { title: 'Healthcare Appointments API', version: '1.2.0' },
  servers: [{ url: 'https://api.health.example.com/appointments/v1' }],
  security: [{ patientOAuth: ['appointments:read'] }, { '#/components/securitySchemes/clinic-key': [] }, { 'staff-sso': [] }],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', security: [{ '#/components/securitySchemes/patientOAuth': [] }], responses },
      query: { operationId: 'searchAppointments', security: [{ 'clinic-key': [] }], responses },
      additionalOperations: {
        COPY: { operationId: 'copyAppointment', security: [{ 'https://api.health.example.com/appointments/openapi.yaml#/components/securitySchemes/patientOAuth': [] }], responses },
        PURGE: { operationId: 'purgeAppointments', security: [{ '#/components/securitySchemes/clinic%2Dkey': [] }], responses },
        LINK: { operationId: 'linkAppointment', security: [{ '#/x-shared-security/LegacyKey': [] }], responses },
        LOCK: { operationId: 'lockAppointment', responses },
      },
    },
    '/appointments/{appointmentId}': {
      get: { operationId: 'getAppointment', security: [{ 'https://other.example.com/openapi.yaml#/components/securitySchemes/clinicKey': [] }], responses },
      put: { operationId: 'replaceAppointment', security: [{ 'shared-schemes.yaml#/PartnerKey': [] }], responses },
      delete: {
        operationId: 'cancelAppointment',
        security: [{ patientOAuth: [], reminderKey: [] }],
        responses,
        callbacks: {
          cancelled: { '{$request.body#/callbackUrl}': { query: { operationId: 'cancelledCallback', security: [{ 'clinic-key': [] }], responses } } },
        },
      },
    },
  },
  webhooks: {
    appointmentReminder: {
      additionalOperations: { NOTIFY: { operationId: 'reminderWebhook', security: [{ reminderKey: [] }], responses } },
    },
  },
  components: {
    securitySchemes: {
      patientOAuth: { type: 'oauth2', flows: { authorizationCode: { authorizationUrl: 'https://auth.health.example.com/authorize', tokenUrl: 'https://auth.health.example.com/token', scopes: { 'appointments:read': 'Read' } } } },
      'clinic-key': { type: 'apiKey', in: 'header', name: 'X-Clinic-Key' },
      'staff-sso': { type: 'openIdConnect', openIdConnectUrl: 'https://auth.health.example.com/.well-known/openid-configuration' },
      reminderKey: { type: 'apiKey', in: 'header', name: 'X-Reminder-Key' },
    },
  },
  'x-shared-security': { LegacyKey: { type: 'apiKey', in: 'query', name: 'key' } },
};
