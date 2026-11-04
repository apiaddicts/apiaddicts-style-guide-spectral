module.exports = {
  openapi: '3.0.3',
  info: { title: 'Travel Booking API', version: '2.0.0' },
  servers: [{ url: 'https://api.travel.example.com/v2' }],
  security: [{ TravellerOAuth: [] }],
  paths: {
    '/bookings': {
      get: {
        operationId: 'listBookings',
        security: [{ TravellerOAuth: ['bookings:read'] }, { Unknown: [] }, { CircularA: [] }, { Dangling: [] }],
        responses: { 200: { description: 'Bookings page' } },
      },
      post: {
        operationId: 'createBooking',
        security: [{ AgencyOAuth: ['bookings:write'] }],
        callbacks: {
          bookingConfirmed: { $ref: '#/components/callbacks/BookingConfirmed' },
        },
        responses: { 201: { description: 'Booking created' } },
      },
    },
  },
  components: {
    callbacks: {
      BookingConfirmed: {
        '{$request.body#/callbackUrl}': {
          post: {
            security: [{ AgencyOAuth: [] }],
            responses: { 204: { description: 'Acknowledged' } },
          },
        },
      },
    },
    securitySchemes: {
      TravellerOAuth: { $ref: '#/components/securitySchemes/TravellerOAuthBase' },
      TravellerOAuthBase: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://auth.travel.example.com/authorize',
            tokenUrl: 'https://auth.travel.example.com/token',
            scopes: { 'bookings:read': 'Read bookings' },
          },
        },
      },
      AgencyOAuth: { $ref: '#/x-shared-security/CorporateOAuth' },
      CircularA: { $ref: '#/components/securitySchemes/CircularB' },
      CircularB: { $ref: '#/components/securitySchemes/CircularA' },
      Dangling: { $ref: '#/components/securitySchemes/DoesNotExist' },
    },
  },
  'x-shared-security': {
    CorporateOAuth: {
      type: 'oauth2',
      flows: {
        clientCredentials: {
          tokenUrl: 'https://auth.travel.example.com/token',
          scopes: { 'bookings:write': 'Create bookings' },
        },
      },
    },
  },
};
