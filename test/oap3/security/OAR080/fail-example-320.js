const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.health.example.com/appointments/openapi.yaml',
  info: { title: 'Healthcare Appointments API', version: '1.2.0' },
  servers: [{ url: 'https://api.health.example.com/appointments/v1' }],
  security: [
    { patientOAuth: ['appointments:read'] },
    { 'https://api.health.example.com/appointments/openapi.yaml#/components/securitySchemes/clinicKey': [] },
    { '#/components/securitySchemes/ghostRoot': [] },
  ],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', security: [{ '#/components/securitySchemes/patientOAuth': [] }], responses },
      query: { operationId: 'searchAppointments', security: [{ searchKey: [] }], responses },
      additionalOperations: {
        COPY: { operationId: 'copyAppointment', security: [{ '#/components/securitySchemes/partnerDigest': [] }], responses },
        PURGE: { operationId: 'purgeAppointments', security: [{ clinicKey: [] }], responses },
        LINK: { operationId: 'linkAppointment', security: [{ '#/x-shared-security/LegacyKey': [] }], responses },
      },
    },
    '/appointments/{appointmentId}': {
      get: { operationId: 'getAppointment', security: [{ 'https://other.example.com/openapi.yaml#/components/securitySchemes/clinicKey': [] }], responses },
      delete: {
        operationId: 'cancelAppointment',
        security: [{ patientOAuth: [], partnerBasic: [] }],
        responses,
        callbacks: {
          cancelled: {
            '{$request.body#/callbackUrl}': {
              query: { operationId: 'cancelledCallback', security: [{ '#/components/securitySchemes/callbackKey': [] }], responses },
            },
          },
        },
      },
    },
  },
  webhooks: {
    appointmentReminder: {
      post: {
        operationId: 'reminderWebhook',
        security: [{ 'https://api.health.example.com/appointments/openapi.yaml#/x-shared-security/Missing': [] }],
        responses,
      },
      additionalOperations: { NOTIFY: { operationId: 'reminderNoticeWebhook', security: [{ reminderKey: [] }], responses } },
    },
  },
  components: {
    securitySchemes: {
      patientOAuth: { type: 'oauth2', flows: { authorizationCode: { authorizationUrl: 'https://auth.health.example.com/authorize', tokenUrl: 'https://auth.health.example.com/token', scopes: { 'appointments:read': 'Read' } } } },
      clinicKey: { type: 'apiKey', in: 'header', name: 'X-Clinic-Key' },
      partnerBasic: { type: 'http', scheme: 'basic' },
    },
  },
  'x-shared-security': { LegacyKey: { type: 'apiKey', in: 'query', name: 'key' } },
};
