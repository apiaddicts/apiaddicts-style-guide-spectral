module.exports = {
  openapi: '3.0.3',
  info: { title: 'Travel Booking API', version: '1.9.0' },
  servers: [{ url: 'https://api.travel.example.com/v1' }],
  paths: {
    '/bookings': {
      get: {
        operationId: 'listBookings',
        security: [{ TravellerOAuth: ['bookings:read'] }],
        responses: { 200: { description: 'Bookings page' } },
      },
      post: {
        operationId: 'createBooking',
        security: [{ AgencyOAuth: ['bookings:write'] }],
        responses: { 201: { description: 'Booking created' } },
      },
    },
    '/bookings/{bookingId}': {
      $ref: '#/components/x-path-items/BookingDetail',
    },
  },
  components: {
    'x-path-items': {
      BookingDetail: {
        parameters: [{ name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } }],
        get: {
          operationId: 'getBooking',
          security: [{ LegacyOAuth: [] }],
          responses: { 200: { description: 'Booking' }, 404: { description: 'Not found' } },
        },
      },
    },
    securitySchemes: {
      TravellerOAuth: { $ref: '#/components/securitySchemes/LegacyOAuth' },
      LegacyOAuth: { $ref: '#/components/securitySchemes/LegacyOAuthBase' },
      LegacyOAuthBase: {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'https://auth.travel.example.com/authorize',
            scopes: { 'bookings:read': 'Read bookings' },
          },
          authorizationCode: {
            authorizationUrl: 'https://auth.travel.example.com/authorize',
            tokenUrl: 'https://auth.travel.example.com/token',
            scopes: { 'bookings:read': 'Read bookings' },
          },
        },
      },
      AgencyOAuth: { $ref: '#/x-shared-security/CorporateOAuth' },
    },
  },
  'x-shared-security': {
    CorporateOAuth: {
      type: 'oauth2',
      flows: {
        password: {
          tokenUrl: 'https://auth.travel.example.com/token',
          scopes: { 'bookings:write': 'Create bookings' },
        },
        clientCredentials: {
          tokenUrl: 'https://auth.travel.example.com/token',
          scopes: { 'bookings:write': 'Create bookings' },
        },
      },
    },
  },
};
