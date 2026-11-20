const responses = { 200: { description: 'Ok' } };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://api.health.example.com/appointments/openapi.yaml',
  info: { title: 'Healthcare Appointments API', version: '1.2.0' },
  servers: [
    { url: '/appointments/v1', name: 'self-relative', description: 'Relative to $self' },
    { url: 'https://api.health.example.com/appointments/v1', name: 'production' },
  ],
  paths: {
    '/appointments': {
      get: { operationId: 'listAppointments', responses },
      query: { operationId: 'searchAppointments', servers: [{ url: './search', name: 'search' }], responses },
      additionalOperations: {
        COPY: { operationId: 'copyAppointment', servers: [{ url: '/copies' }], responses },
        PURGE: { operationId: 'purgeAppointments', servers: [{ url: 'https://purge.health.example.com/appointments/v1' }], responses },
        LINK: { operationId: 'linkAppointment', servers: [{ url: 'https://{clinic}.health.example.com', variables: { clinic: { enum: ['north'] } } }], responses },
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
  components: {
    schemas: {
      Appointment: {
        type: 'object',
        properties: {
          startsAt: { type: 'string', format: 'date-time' },
          notes: { type: ['string', 'null'] },
        },
      },
    },
  },
};
