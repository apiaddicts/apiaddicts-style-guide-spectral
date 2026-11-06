module.exports = {
  openapi: '3.0.3',
  info: { title: 'Hotel Reservations API', version: '2.3.1' },
  servers: [{ url: 'https://api.hotels.example.com/v2' }],
  paths: {
    '/reservations': {
      post: {
        operationId: 'createReservation',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ReservationRequest' } } } },
        parameters: [{ name: 'debug', in: 'query', schema: { type: 'object', properties: { stackTrace: { type: 'boolean' } } } }],
        callbacks: {
          reservationConfirmed: {
            '{$request.body#/callbackUrl}': {
              post: {
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } } } } } },
                responses: {
                  500: { description: 'Partner failure', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Reservation with diagnostics',
            content: {
              'application/json': { schema: { oneOf: [{ $ref: '#/components/schemas/Reservation' }, { $ref: '#/components/schemas/Diagnostics' }] } },
            },
          },
          400: {
            description: 'Invalid reservation, the stack trace is never returned',
            headers: { 'X-Stack-Trace-Id': { schema: { type: 'string' } } },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { code: { type: 'string' }, traceId: { type: 'string' }, callStack: { type: 'string' } },
                  not: { type: 'object', required: ['stackTrace'], properties: { stackTrace: { type: 'string' } } },
                },
                examples: { withTrace: { value: { code: 'E1', stackTrace: 'removed' } } },
              },
            },
            links: { stackTraceLink: { operationId: 'createReservation' } },
          },
          404: { description: 'Room not found', content: { 'text/plain': { schema: { type: 'string', enum: ['stackTrace'] } } } },
          'x-internal': { description: 'Debug only', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } },
        },
      },
    },
    '/reservations/{reservationId}': {
      parameters: [{ name: 'reservationId', in: 'path', required: true, schema: { type: 'string' } }],
      query: {
        operationId: 'queryReservation',
        responses: { 500: { description: 'Not an OpenAPI 3.0 method', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } } },
      },
      get: {
        operationId: 'getReservation',
        responses: {
          200: { description: 'Reservation', content: { 'application/json': { schema: { $ref: '#/components/schemas/Diagnostics' } } } },
          503: {
            description: 'Streaming item schemas only exist in OpenAPI 3.2',
            content: { 'application/jsonl': { itemSchema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } },
          },
        },
      },
    },
  },
  components: {
    responses: {
      UnusedServerError: { description: 'Unused', content: { 'application/json': { schema: { type: 'object', properties: { stackTrace: { type: 'string' } } } } } },
    },
    schemas: {
      Reservation: { type: 'object', properties: { id: { type: 'string' }, roomId: { type: 'string' } } },
      Diagnostics: { type: 'object', properties: { stackTrace: { type: 'string' }, host: { type: 'string' } } },
      ReservationRequest: { type: 'object', properties: { roomId: { type: 'string' }, stack_trace: { type: 'string' } } },
    },
  },
};
