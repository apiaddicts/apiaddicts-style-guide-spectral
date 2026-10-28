module.exports = {
  openapi: '3.0.3',
  info: { title: 'Travel Booking API', version: '1.9.0' },
  servers: [{ url: 'https://api.travel.example.com/v1' }],
  paths: {
    '/bookings': {
      get: { operationId: 'listBookings', security: [{ TravellerOAuth: [] }], responses: { 200: { description: 'Ok' } } },
      post: { operationId: 'createBooking', security: [{ AgencyOAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
  },
  components: {
    securitySchemes: {
      TravellerOAuth: { $ref: '#/components/securitySchemes/LegacyOAuth' },
      LegacyOAuth: { $ref: '#/components/securitySchemes/LegacyOAuthBase' },
      LegacyOAuthBase: {
        type: 'oauth2',
        flows: { implicit: { authorizationUrl: 'https://legacy-login.travel.example.com/login', scopes: {} } },
      },
      AgencyOAuth: { $ref: '#/x-shared-security/CorporateOAuth' },
    },
  },
  'x-shared-security': {
    CorporateOAuth: {
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'http://corporate.travel.example.com/oauth/authorize',
          tokenUrl: 'https://corporate.travel.example.com/oauth/token',
          scopes: {},
        },
      },
    },
  },
};
