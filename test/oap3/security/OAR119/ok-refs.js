module.exports = {
  openapi: '3.0.3',
  info: { title: 'Travel Booking API', version: '2.0.0' },
  servers: [{ url: 'https://api.travel.example.com/v2' }],
  security: [{ TravellerOAuth: [] }],
  paths: {
    '/bookings': {
      get: {
        operationId: 'listBookings',
        security: [{ TravellerOAuth: [] }, { Unknown: [] }, { CircularA: [] }, { Dangling: [] }],
        responses: { 200: { description: 'Ok' } },
      },
      post: {
        operationId: 'createBooking',
        security: [{ AgencyOAuth: [] }],
        callbacks: { bookingConfirmed: { $ref: '#/components/callbacks/BookingConfirmed' } },
        responses: { 201: { description: 'Created' } },
      },
    },
  },
  components: {
    callbacks: {
      BookingConfirmed: {
        '{$request.body#/callbackUrl}': {
          post: { security: [{ AgencyOAuth: [] }], responses: { 204: { description: 'Received' } } },
        },
      },
    },
    securitySchemes: {
      TravellerOAuth: { $ref: '#/components/securitySchemes/TravellerOAuthBase' },
      TravellerOAuthBase: {
        type: 'oauth2',
        flows: { implicit: { authorizationUrl: 'https://login.travel.example.com/oauth/authorize', scopes: {} } },
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
        authorizationCode: {
          authorizationUrl: 'https://corporate.travel.example.com/oauth/authorize',
          tokenUrl: 'https://corporate.travel.example.com/oauth/token',
          scopes: {},
        },
      },
    },
  },
};
