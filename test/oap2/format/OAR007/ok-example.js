module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR007 ok example (oas2)' },
  produces: ['application/json'],
  paths: {
    '/invoices': {
      get: {
        responses: {
          200: { description: 'GET is exempt in OAS2' },
        },
      },
      post: {
        produces: ['application/xml'],
        responses: {
          201: { description: 'Own produces satisfies the check (any non-empty value)' },
        },
      },
      put: {
        responses: {
          200: { description: 'Falls back to a non-empty global produces' },
        },
      },
    },
    '/orders': {
      patch: {
        produces: ['text/plain'],
        responses: {
          200: { description: 'Own produces satisfies the check' },
        },
      },
      delete: {
        responses: {
          204: { description: 'DELETE is exempt in OAS2' },
        },
      },
    },
  },
};
