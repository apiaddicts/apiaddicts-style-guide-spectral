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
      parameters: [{ $ref: '#/components/parameters/clinicHeader' }],
      get: {
        operationId: 'listAppointments',
        parameters: [{ $ref: '#/components/parameters/startSlate' }, { $ref: '#/components/parameters/limitParam' }],
        responses: ok,
      },
      query: {
        operationId: 'searchAppointments',
        parameters: [
          { $ref: '#/components/parameters/searchFilters' },
          { $ref: `${SELF}#/components/parameters/searchTermParam` },
        ],
        responses: ok,
      },
      additionalOperations: {
        COPY: { operationId: 'copyAppointments', parameters: [{ $ref: `${SELF}#/components/parameters/copyTarget` }], responses: ok },
        PURGE: { operationId: 'purgeAppointments', parameters: [{ $ref: '#/components/parameters/purgeReasonParam' }], responses: ok },
      },
    },
    '/appointments/{appointmentId}': { $ref: '#/components/pathItems/Appointment' },
    '/appointments/{appointmentId}/cancel': {
      post: {
        operationId: 'cancelAppointment',
        parameters: [{ $ref: '#/components/parameters/selfChainParam' }],
        responses: ok,
        callbacks: {
          cancelled: {
            '{$request.body#/callbackUrl}': {
              query: { operationId: 'cancelledCallback', parameters: [{ $ref: '#/components/parameters/callbackFilter' }], responses: ok },
              additionalOperations: {
                NOTIFY: { operationId: 'cancelledNotify', parameters: [{ $ref: '#/components/parameters/notifyChannel' }], responses: ok },
              },
            },
          },
        },
      },
    },
  },
  webhooks: {
    appointmentReminder: {
      post: { operationId: 'appointmentReminder', parameters: [{ $ref: '#/components/parameters/reminderChannel' }], responses: ok },
      additionalOperations: {
        NOTIFY: { operationId: 'reminderNotify', parameters: [{ $ref: '#/components/parameters/reminderSignature' }], responses: ok },
      },
    },
  },
  'x-shared-params': {
    hopParam: { $ref: '#/components/parameters/hopTarget' },
  },
  components: {
    parameters: {
      clinicHeader: { name: 'X-Clinic-Id', in: 'header', required: true, schema: { type: 'string' } },
      startSlate: { name: '$start', in: 'query', schema: text('integer') },
      limitParam: { name: '$limit', in: 'query', schema: text('integer') },
      searchFilters: { name: 'filters', in: 'querystring', content: { 'application/x-www-form-urlencoded': { schema: { type: 'object' } } } },
      searchTermParam: { name: 'term', in: 'query', schema: text() },
      copyTarget: { name: 'target', in: 'query', schema: { type: 'string' } },
      purgeReasonParam: { name: 'reason', in: 'query', schema: { type: 'string' } },
      callbackFilter: { name: 'filter', in: 'query', schema: { type: 'string' } },
      notifyChannel: { name: 'channel', in: 'query', schema: { type: 'string' } },
      reminderChannel: { name: 'channel', in: 'query', schema: { type: 'string' } },
      reminderSignature: { name: 'X-Signature', in: 'header', schema: { type: 'string' } },
      appointmentId: { name: 'appointmentId', in: 'path', required: true, schema: { type: 'string' } },
      includeHistory: { name: 'includeHistory', in: 'query', schema: { type: 'boolean' } },
      lockOwnerParam: { name: 'owner', in: 'query', schema: { type: 'string' } },
      selfChainParam: { $ref: `${SELF}#/x-shared-params/hopParam` },
      hopTarget: { name: 'hop', in: 'query', schema: { type: 'string' } },
      aliasParam: { $ref: `${SELF}#/components/parameters/alias` },
      alias: { name: 'alias', in: 'query', schema: { type: 'string' } },
    },
    mediaTypes: {
      AppointmentList: { schema: { type: 'array', items: { type: 'object' } } },
    },
    pathItems: {
      Appointment: {
        parameters: [{ $ref: '#/components/parameters/appointmentId' }],
        get: { operationId: 'getAppointment', responses: ok },
        query: { operationId: 'queryAppointment', parameters: [{ $ref: '#/components/parameters/includeHistory' }], responses: ok },
        additionalOperations: {
          LOCK: { operationId: 'lockAppointment', parameters: [{ $ref: '#/components/parameters/lockOwnerParam' }], responses: ok },
        },
      },
    },
  },
};
