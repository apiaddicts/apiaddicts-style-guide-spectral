const SELF = 'https://api.health.example.com/appointments/openapi.yaml';
const ok = { 200: { description: 'Ok', content: { 'application/json': { schema: { type: 'object' } } } } };
const text = (type = 'string') => ({ type: [type, 'null'] });

module.exports = {
  openapi: '3.2.0',
  $self: SELF,
  info: { title: 'Clinic Appointments API', version: '1.5.0' },
  servers: [{ url: 'https://api.health.example.com/appointments/v1' }],
  paths: {
    '/appointments': {
      parameters: [{ $ref: '#/components/parameters/clinicHeaderParam' }],
      get: {
        operationId: 'listAppointments',
        parameters: [{ $ref: '#/components/parameters/startParam' }, { $ref: '#/components/parameters/limitParam' }],
        responses: ok,
      },
      query: {
        operationId: 'searchAppointments',
        parameters: [
          { $ref: '#/components/parameters/searchFiltersParam' },
          { $ref: `${SELF}#/components/parameters/searchTermParam` },
        ],
        responses: ok,
      },
      additionalOperations: {
        COPY: { operationId: 'copyAppointments', parameters: [{ $ref: `${SELF}#/components/parameters/copyTargetParam` }], responses: ok },
        PURGE: { operationId: 'purgeAppointments', parameters: [{ $ref: '#/components/parameters/purgeReasonParam' }], responses: ok },
      },
    },
    '/appointments/{appointmentId}': { $ref: '#/components/pathItems/Appointment' },
    '/appointments/{appointmentId}/cancel': {
      post: {
        operationId: 'cancelAppointment',
        parameters: [{ $ref: '#/components/parameters/selfChainParam' }, { $ref: 'https://other.example.com/openapi.yaml#/components/parameters/partnerParam' }],
        responses: ok,
        callbacks: {
          cancelled: {
            '{$request.body#/callbackUrl}': {
              query: { operationId: 'cancelledCallback', parameters: [{ $ref: '#/components/parameters/callbackFilterParam' }], responses: ok },
              additionalOperations: {
                NOTIFY: { operationId: 'cancelledNotify', parameters: [{ $ref: '#/components/parameters/notifyChannelParam' }], responses: ok },
              },
            },
          },
        },
      },
    },
  },
  webhooks: {
    appointmentReminder: {
      post: { operationId: 'appointmentReminder', parameters: [{ $ref: '#/components/parameters/reminderChannelParam' }], responses: ok },
      additionalOperations: {
        NOTIFY: { operationId: 'reminderNotify', parameters: [{ $ref: '#/components/parameters/reminderSignatureParam' }], responses: ok },
      },
    },
  },
  'x-shared-params': {
    hopParam: { $ref: '#/components/parameters/hopTargetParam' },
  },
  components: {
    parameters: {
      clinicHeaderParam: { name: 'X-Clinic-Id', in: 'header', required: true, schema: { type: 'string' } },
      startParam: { name: '$start', in: 'query', schema: text('integer') },
      limitParam: { name: '$limit', in: 'query', schema: text('integer') },
      searchFiltersParam: { name: 'filters', in: 'querystring', content: { 'application/x-www-form-urlencoded': { schema: { type: 'object' } } } },
      searchTermParam: { name: 'term', in: 'query', schema: text() },
      copyTargetParam: { name: 'target', in: 'query', schema: { type: 'string' } },
      purgeReasonParam: { name: 'reason', in: 'query', schema: { type: 'string' } },
      callbackFilterParam: { name: 'filter', in: 'query', schema: { type: 'string' } },
      notifyChannelParam: { name: 'channel', in: 'query', schema: { type: 'string' } },
      reminderChannelParam: { name: 'channel', in: 'query', schema: { type: 'string' } },
      reminderSignatureParam: { name: 'X-Signature', in: 'header', schema: { type: 'string' } },
      appointmentIdParam: { name: 'appointmentId', in: 'path', required: true, schema: { type: 'string' } },
      includeHistoryParam: { name: 'includeHistory', in: 'query', schema: { type: 'boolean' } },
      lockOwnerParam: { name: 'owner', in: 'query', schema: { type: 'string' } },
      selfChainParam: { $ref: `${SELF}#/x-shared-params/hopParam` },
      hopTargetParam: { name: 'hop', in: 'query', schema: { type: 'string' } },
    },
    mediaTypes: {
      AppointmentList: { schema: { type: 'array', items: { type: 'object' } } },
    },
    pathItems: {
      Appointment: {
        parameters: [{ $ref: '#/components/parameters/appointmentIdParam' }],
        get: { operationId: 'getAppointment', responses: ok },
        query: { operationId: 'queryAppointment', parameters: [{ $ref: '#/components/parameters/includeHistoryParam' }], responses: ok },
        additionalOperations: {
          LOCK: { operationId: 'lockAppointment', parameters: [{ $ref: '#/components/parameters/lockOwnerParam' }], responses: ok },
        },
      },
    },
  },
};
