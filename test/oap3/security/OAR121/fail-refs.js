module.exports = {
  openapi: '3.0.3',
  info: { title: 'Travel Booking API', version: '1.9.0' },
  servers: [{ url: 'https://api.travel.example.com/v1' }],
  paths: {
    '/bookings': {
      get: { operationId: 'listBookings', security: [{ TravellerBasic: [] }], responses: { 200: { description: 'Ok' } } },
      post: { operationId: 'createBooking', security: [{ AgencyKey: [] }], responses: { 201: { description: 'Created' } } },
    },
  },
  components: {
    securitySchemes: {
      TravellerBasic: { $ref: '#/components/securitySchemes/LegacyBasic' },
      LegacyBasic: { $ref: '#/components/securitySchemes/LegacyBasicBase' },
      LegacyBasicBase: { type: 'http', scheme: 'basic' },
      AgencyKey: { $ref: '#/x-shared-security/CorporateKey' },
    },
  },
  'x-shared-security': {
    CorporateKey: { type: 'apiKey', in: 'header', name: 'X-Agency-Key' },
  },
};
