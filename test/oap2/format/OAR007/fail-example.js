module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR007 fail example (oas2)' },
  paths: {
    '/invoices': {
      get: {
        responses: {
          200: { description: 'GET is exempt in OAS2, even without any produces' },
        },
      },
      post: {
        responses: {
          201: { description: 'No produces anywhere' },
        },
      },
      put: {
        produces: [],
        responses: {
          200: { description: 'Empty produces array on the operation' },
        },
      },
    },
    '/orders': {
      patch: {
        responses: {
          200: { description: 'No own produces, no global produces to fall back to' },
        },
      },
      delete: {
        responses: {
          204: { description: 'DELETE is exempt in OAS2, even without any produces' },
        },
      },
    },
  },
};
