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
    { url: 'https://travel.example.com/bookings/v3', name: 'legacy', description: 'No prefix' },
    { url: 'https://travel.example.com/v3/api-bookings', name: 'versionFirst', description: 'Prefix after the version' },
    { url: 'https://travel.example.com/', name: 'root', description: 'Root base path' },
    { url: 'https://travel.example.com/api-/v3', name: 'emptyName', description: 'Prefix without a name' },
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
