const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.health.example.com/appointments/openapi.yaml',
  info: { title: 'Healthcare Appointments API', version: '1.2.0' },
  servers: [
    { url: 'https://api.health.example.com/appointments/v1', name: 'production', description: 'Public gateway' },
    { url: 'http://appointments-service:8080/appointments/v1', name: 'upstream' },
  ],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', responses },
      query: { operationId: 'searchAppointments', servers: [{ url: 'https://search.health.example.com/appointments/v1', name: 'search' }], responses },
      additionalOperations: {
        COPY: { operationId: 'copyAppointment', servers: [{ url: 'https://{clinic}.health.example.com/appointments/v1', variables: { clinic: { default: 'north' } } }], responses },
        PURGE: { operationId: 'purgeAppointments', responses },
      },
    },
    '/appointments/{appointmentId}': {
      delete: {
        operationId: 'cancelAppointment',
        responses,
        callbacks: {
          cancelled: {
            '{$request.body#/callbackUrl}': {
              query: { operationId: 'cancelledCallback', servers: [{ url: '/callbacks' }], responses },
            },
          },
        },
      },
    },
  },
  webhooks: {
    appointmentReminder: {
      post: { operationId: 'reminderWebhook', servers: [{ url: '/webhooks' }], responses },
      additionalOperations: { NOTIFY: { operationId: 'reminderNotice', servers: [{ url: '/webhooks/notify' }], responses } },
    },
  },
};
