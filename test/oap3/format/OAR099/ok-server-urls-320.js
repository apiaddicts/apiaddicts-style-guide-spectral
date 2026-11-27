const bookingSchema = { $ref: '#/components/schemas/Booking' };

module.exports = {
  openapi: '3.2.0',
  $self: 'https://travel.example.com/specs/bookings.yaml',
  info: {
    title: 'Travel Bookings API',
    summary: 'Flight and hotel bookings for corporate travel.',
    version: '3.0.0',
  },
  servers: [
    { url: 'https://travel.example.com/api-bookings/v3', name: 'production', description: 'Production' },
    { url: 'https://sandbox.travel.example.com/api-bookings/v3', name: 'sandbox', description: 'Sandbox' },
    { url: '/api-bookings/v3', name: 'relative', description: 'Relative URL' },
    {
      url: 'https://travel.example.com/api-{line}/v3',
      name: 'productLine',
      description: 'Templated name after the prefix',
      variables: { line: { default: 'bookings', enum: ['bookings', 'hotels'] } },
    },
  ],
  paths: {
    '/status': {
      get: { operationId: 'getStatus', responses: { 200: { description: 'Up' } } },
    },
    '/bookings': {
      servers: [{ url: 'https://bookings.example.com/bookings/v3', name: 'bookingsHost' }],
      query: {
        operationId: 'searchBookings',
        servers: [{ url: 'https://search.example.com/search/v3', name: 'search' }],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: {
          200: {
            description: 'Matching bookings',
            content: { 'application/json': { schema: { type: 'array', items: bookingSchema } } },
          },
        },
      },
      additionalOperations: {
        LOCK: {
          operationId: 'lockBookings',
          servers: [{ url: 'https://locks.example.com/locks/v1', name: 'locks' }],
          responses: { 204: { description: 'Locked' } },
        },
      },
    },
    '/bookings/{bookingId}': {
      get: {
        operationId: 'getBooking',
        parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'The booking', content: { 'application/json': { schema: bookingSchema } } } },
      },
    },
  },
  components: {
    schemas: {
      Booking: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
          cancelledAt: { type: ['string', 'null'], format: 'date-time' },
          loyaltyNumber: { type: ['string', 'null'] },
        },
      },
    },
  },
};
