module.exports = {
  swagger: '2.0',
  info: { version: '1.0.0', title: 'OAR010 ok example (mixed case, oas2)' },
  produces: ['Application/JSON'],
  paths: {
    '/reports': {
      get: {
        responses: {
          200: { description: 'Mixed-case default media type via global produces' },
        },
      },
    },
  },
};
